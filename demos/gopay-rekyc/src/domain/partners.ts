import { approvedSubmission } from "./ledger";
import type { IdentityData, Ledger, PartnerEvent } from "./types";

export type PullApiResponse =
  | { status: "ok"; accountId: string; submissionId: string; data: IdentityData }
  | { status: "no_data"; accountId: string; reason: "no_approved_submission" };

/** The existing on-demand API returns the approved submission's data, or nothing at all. */
export function pullApprovedData(ledger: Ledger): PullApiResponse {
  const approved = approvedSubmission(ledger);
  if (!approved) {
    return {
      status: "no_data",
      accountId: ledger.account.accountId,
      reason: "no_approved_submission",
    };
  }
  return {
    status: "ok",
    accountId: ledger.account.accountId,
    submissionId: approved.id,
    data: approved.data,
  };
}

/** Callbacks carry the account identifier, what happened, and when — nothing else. */
export function callbackPayload(event: PartnerEvent) {
  return {
    account_id: event.accountId,
    event: event.event,
    occurred_at: event.occurredAt,
  };
}

export function eventsForPartner(ledger: Ledger, partner: string): PartnerEvent[] {
  return ledger.partnerEvents.filter((event) => event.partner === partner);
}
