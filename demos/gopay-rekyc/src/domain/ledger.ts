import { makeId } from "@/lib/id";
import { resetOddInterval } from "./odd";
import type {
  DecisionActor,
  IdentityData,
  KycAccount,
  Ledger,
  PartnerEvent,
  PartnerEventType,
  RejectionReason,
  Submission,
  SubmissionStatus,
} from "./types";

export class LedgerConstraintError extends Error {
  constructor(
    message: string,
    readonly constraint:
      | "one_approved_per_account"
      | "submission_data_immutable"
      | "unknown_submission",
  ) {
    super(message);
    this.name = "LedgerConstraintError";
  }
}

export function approvedSubmission(ledger: Ledger): Submission | null {
  return ledger.submissions.find((submission) => submission.status === "approved") ?? null;
}

/** The data in use is found by status alone — no ordering or fallback logic (PRD 4.3.2). */
export function identityInUse(ledger: Ledger): IdentityData | null {
  return approvedSubmission(ledger)?.data ?? null;
}

/** No approved submission means no tier is reported for the account. */
export function reportedTier(ledger: Ledger) {
  return approvedSubmission(ledger)?.riskTier ?? null;
}

export function assertAtMostOneApproved(submissions: Submission[]): void {
  const approved = submissions.filter((submission) => submission.status === "approved");
  if (approved.length > 1) {
    throw new LedgerConstraintError(
      "at most one submission per account may be approved",
      "one_approved_per_account",
    );
  }
}

/** Rejects any attempt to edit or delete submission data — the row is append-only. */
export function assertSubmissionDataUnchanged(before: Submission, after: Submission): void {
  const dataChanged = JSON.stringify(before.data) !== JSON.stringify(after.data);
  const docsChanged = JSON.stringify(before.documents) !== JSON.stringify(after.documents);
  if (dataChanged || docsChanged) {
    throw new LedgerConstraintError(
      "submission data and documents are immutable once written",
      "submission_data_immutable",
    );
  }
}

function partnerNotifications(
  account: KycAccount,
  event: PartnerEventType,
  occurredAt: string,
): PartnerEvent[] {
  return account.linkedPartners.map((partner) => ({
    id: makeId("evt"),
    partner,
    accountId: account.accountId,
    event,
    occurredAt,
  }));
}

function replaceSubmission(submissions: Submission[], next: Submission): Submission[] {
  return submissions.map((submission) => (submission.id === next.id ? next : submission));
}

function requireSubmission(ledger: Ledger, submissionId: string): Submission {
  const submission = ledger.submissions.find((item) => item.id === submissionId);
  if (!submission) {
    throw new LedgerConstraintError(`unknown submission ${submissionId}`, "unknown_submission");
  }
  return submission;
}

export interface LedgerTransaction {
  ledger: Ledger;
  /** Human-readable trace of everything the transaction touched, shown in the demo console. */
  effects: string[];
}

export function appendSubmission(ledger: Ledger, submission: Submission): Ledger {
  return { ...ledger, submissions: [...ledger.submissions, submission] };
}

/**
 * Approving writes the new submission as approved and supersedes the previously approved one in the
 * same transaction. The account's status is restored when it was downgraded, the ODD interval is
 * reset from the newly assessed tier, and every linked partner is notified.
 */
export function approveSubmission(
  ledger: Ledger,
  submissionId: string,
  options: { actor: DecisionActor; at: string },
): LedgerTransaction {
  const target = requireSubmission(ledger, submissionId);
  const effects: string[] = [];
  const previous = approvedSubmission(ledger);

  let submissions = replaceSubmission(ledger.submissions, {
    ...target,
    status: "approved",
    decidedAt: options.at,
    decidedBy: options.actor,
    rejectionReason: null,
  });
  effects.push(`submission ${target.id} → approved (by ${options.actor})`);

  let partnerEvents = ledger.partnerEvents;

  if (previous && previous.id !== target.id) {
    submissions = replaceSubmission(submissions, {
      ...previous,
      status: "rejected",
      decidedAt: options.at,
      decidedBy: "system",
      rejectionReason: "superseded_by_newer_approval",
    });
    effects.push(`submission ${previous.id} → rejected (superseded_by_newer_approval, system-set)`);
  }

  assertAtMostOneApproved(submissions);

  const account: KycAccount = {
    ...ledger.account,
    kycStatus: "approved",
    walletLevel: "gopay_plus",
    oddLastReviewAt: options.at,
    oddDueAt: resetOddInterval(options.at, target.riskTier),
  };
  if (ledger.account.kycStatus === "downgraded") {
    effects.push("account KYC status restored to approved in the same transaction");
  }
  effects.push(`ODD interval reset for ${target.riskTier} risk → due ${account.oddDueAt}`);

  partnerEvents = [
    ...partnerEvents,
    ...partnerNotifications(account, "reverification.approved", options.at),
  ];
  effects.push(`notified ${account.linkedPartners.length} linked partners (no identity data)`);

  return { ledger: { account, submissions, partnerEvents }, effects };
}

/**
 * A rejected attempt changes nothing else. Rejecting the *approved* submission downgrades the
 * account in the same transaction and promotes nothing in its place.
 */
export function rejectSubmission(
  ledger: Ledger,
  submissionId: string,
  options: { actor: DecisionActor; at: string; reason: RejectionReason },
): LedgerTransaction {
  const target = requireSubmission(ledger, submissionId);
  const effects: string[] = [];
  const wasApproved = target.status === "approved";

  const submissions = replaceSubmission(ledger.submissions, {
    ...target,
    status: "rejected",
    decidedAt: options.at,
    decidedBy: options.actor,
    rejectionReason: options.reason,
  });
  effects.push(`submission ${target.id} → rejected (${options.reason}, by ${options.actor})`);

  let account = ledger.account;
  let partnerEvents = ledger.partnerEvents;

  if (wasApproved) {
    account = { ...account, kycStatus: "downgraded", walletLevel: "gopay_basic" };
    effects.push("approved submission rejected → account KYC status downgraded (same transaction)");
    partnerEvents = [
      ...partnerEvents,
      ...partnerNotifications(account, "reverification.revoked", options.at),
    ];
    effects.push("partners notified that the approved submission was revoked");
  } else {
    effects.push("no change to account status, data in use, review date, or risk tier");
  }

  return { ledger: { account, submissions, partnerEvents }, effects };
}

/** Agent decision override: only the existing submission's status changes, no new row is created. */
export function overrideDecision(
  ledger: Ledger,
  submissionId: string,
  next: SubmissionStatus,
  options: { at: string; reason?: RejectionReason },
): LedgerTransaction {
  const target = requireSubmission(ledger, submissionId);
  const countBefore = ledger.submissions.length;

  let result: LedgerTransaction;
  switch (next) {
    case "approved":
      result = approveSubmission(ledger, submissionId, { actor: "agent", at: options.at });
      break;
    case "rejected":
      result = rejectSubmission(ledger, submissionId, {
        actor: "agent",
        at: options.at,
        reason: options.reason ?? "agent_rejected",
      });
      break;
    case "pending_review": {
      const submissions = replaceSubmission(ledger.submissions, {
        ...target,
        status: "pending_review",
        decidedAt: null,
        decidedBy: null,
        rejectionReason: null,
      });
      result = {
        ledger: { ...ledger, submissions },
        effects: [`submission ${target.id} → pending_review (by agent)`],
      };
      break;
    }
    default: {
      const exhaustive: never = next;
      throw new Error(`unhandled submission status ${String(exhaustive)}`);
    }
  }

  if (result.ledger.submissions.length !== countBefore) {
    throw new LedgerConstraintError(
      "changing a decision must not create a submission",
      "submission_data_immutable",
    );
  }
  for (const before of ledger.submissions) {
    const after = result.ledger.submissions.find((item) => item.id === before.id);
    if (after) assertSubmissionDataUnchanged(before, after);
  }
  return result;
}

/** re-KYC is available only to accounts whose KYC status is approved (PRD 4.3.1). */
export function canStartReKyc(ledger: Ledger): boolean {
  return ledger.account.kycStatus === "approved" && approvedSubmission(ledger) !== null;
}
