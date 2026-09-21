import { describe, expect, it } from "vitest";
import { addDays } from "@/lib/format";
import {
  ODD_INTERVAL_MONTHS,
  evaluateBlock,
  isOverdue,
  resetOddInterval,
  shouldShowReminder,
  type BlockEnforcementConfig,
} from "./odd";

const NOW = "2026-09-21T00:00:00.000Z";

const BASE_CONFIG: BlockEnforcementConfig = {
  enabled: true,
  scopeTiers: ["high"],
  scopeDaysPastDue: 30,
};

describe("ODD interval and reminders", () => {
  it("restarts the interval from the newly assessed tier", () => {
    for (const tier of ["low", "medium", "high"] as const) {
      const due = new Date(resetOddInterval(NOW, tier));
      const expected = new Date(NOW);
      expected.setMonth(expected.getMonth() + ODD_INTERVAL_MONTHS[tier]);
      expect(due.toISOString()).toBe(expected.toISOString());
    }
  });

  it("shows the reminder inside the window and keeps showing once overdue", () => {
    expect(shouldShowReminder(NOW, addDays(NOW, 45))).toBe(false);
    expect(shouldShowReminder(NOW, addDays(NOW, 20))).toBe(true);
    expect(shouldShowReminder(NOW, addDays(NOW, -5))).toBe(true);
    expect(isOverdue(NOW, addDays(NOW, -5))).toBe(true);
  });
});

describe("phased block enforcement", () => {
  it("never blocks while enforcement is off", () => {
    const decision = evaluateBlock(NOW, addDays(NOW, -90), "high", {
      ...BASE_CONFIG,
      enabled: false,
    });
    expect(decision).toMatchObject({ blocked: false, reason: "enforcement_disabled" });
  });

  it("blocks only tiers inside the rollout scope", () => {
    expect(evaluateBlock(NOW, addDays(NOW, -45), "high", BASE_CONFIG).blocked).toBe(true);
    expect(evaluateBlock(NOW, addDays(NOW, -45), "low", BASE_CONFIG)).toMatchObject({
      blocked: false,
      reason: "tier_out_of_scope",
    });
  });

  it("waits until the account is far enough past due", () => {
    expect(evaluateBlock(NOW, addDays(NOW, -10), "high", BASE_CONFIG)).toMatchObject({
      blocked: false,
      reason: "not_overdue_enough",
      daysPastDue: 10,
    });
  });

  it("cannot block an account with no reported tier", () => {
    expect(evaluateBlock(NOW, addDays(NOW, -90), null, BASE_CONFIG)).toMatchObject({
      blocked: false,
      reason: "no_tier_reported",
    });
  });
});
