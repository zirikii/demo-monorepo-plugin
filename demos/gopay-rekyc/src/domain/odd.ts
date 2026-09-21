import { addMonths, daysBetween } from "@/lib/format";
import type { RiskTier } from "./types";

/**
 * Review cadence per risk tier. Demo values — the PRD only states that the interval restarts from
 * the newly assessed tier, not the months themselves.
 */
export const ODD_INTERVAL_MONTHS: Record<RiskTier, number> = {
  low: 36,
  medium: 24,
  high: 12,
};

/** How many days before the due date the reminder banner starts showing. */
export const ODD_REMINDER_WINDOW_DAYS = 30;

export function resetOddInterval(fromIso: string, tier: RiskTier): string {
  return addMonths(fromIso, ODD_INTERVAL_MONTHS[tier]);
}

export function daysUntilDue(nowIso: string, dueIso: string): number {
  return daysBetween(nowIso, dueIso);
}

export function isOverdue(nowIso: string, dueIso: string): boolean {
  return daysUntilDue(nowIso, dueIso) < 0;
}

/** Banner starts a set number of days before the due date and keeps showing until completion. */
export function shouldShowReminder(
  nowIso: string,
  dueIso: string,
  windowDays: number = ODD_REMINDER_WINDOW_DAYS,
): boolean {
  return daysUntilDue(nowIso, dueIso) <= windowDays;
}

export interface BlockEnforcementConfig {
  enabled: boolean;
  /** Enforcement can be scoped to a subset of risk tiers. */
  scopeTiers: RiskTier[];
  /** …and to accounts at least this many days past their ODD due date. */
  scopeDaysPastDue: number;
}

export interface BlockDecision {
  blocked: boolean;
  reason:
    | "enforcement_disabled"
    | "not_overdue_enough"
    | "tier_out_of_scope"
    | "overdue_in_scope"
    | "no_tier_reported";
  daysPastDue: number;
}

/**
 * Phase 2 (appendix 5.1): blocking is toggleable independently of the reminder banner and can be
 * rolled out gradually by risk tier and by how far past due the account is.
 */
export function evaluateBlock(
  nowIso: string,
  dueIso: string,
  tier: RiskTier | null,
  config: BlockEnforcementConfig,
): BlockDecision {
  const daysPastDue = -daysUntilDue(nowIso, dueIso);
  if (!config.enabled) {
    return { blocked: false, reason: "enforcement_disabled", daysPastDue };
  }
  if (tier === null) {
    return { blocked: false, reason: "no_tier_reported", daysPastDue };
  }
  if (!config.scopeTiers.includes(tier)) {
    return { blocked: false, reason: "tier_out_of_scope", daysPastDue };
  }
  if (daysPastDue < config.scopeDaysPastDue) {
    return { blocked: false, reason: "not_overdue_enough", daysPastDue };
  }
  return { blocked: true, reason: "overdue_in_scope", daysPastDue };
}
