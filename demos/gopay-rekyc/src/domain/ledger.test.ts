import { beforeEach, describe, expect, it } from "vitest";
import { makeInitialLedger } from "@/data/account";
import { UPDATED_IDENTITY } from "@/data/identity";
import {
  LedgerConstraintError,
  appendSubmission,
  approveSubmission,
  approvedSubmission,
  assertAtMostOneApproved,
  assertSubmissionDataUnchanged,
  canStartReKyc,
  identityInUse,
  overrideDecision,
  rejectSubmission,
  reportedTier,
} from "./ledger";
import type { Ledger, Submission } from "./types";

const NOW = "2026-09-21T03:00:00.000Z";

function reverification(id: string, overrides: Partial<Submission> = {}): Submission {
  return {
    id,
    accountId: "acc_8891207734",
    type: "reverification",
    status: "pending_review",
    submittedAt: NOW,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    data: UPDATED_IDENTITY,
    documents: {
      ktpImageId: "img_ktp_new",
      selfieImageId: "img_fr_selfie",
      selfieSource: "fr_reuse",
    },
    riskScore: 34,
    riskTier: "medium",
    system: {
      frMatchScore: 0.94,
      ocrConfidence: 0.96,
      nikMatchedOnFile: true,
      nameScreeningHit: false,
      riskScoringCacheUsed: false,
      eddRequired: false,
      eddCompleted: false,
      dukcapilSource: "cache",
      dukcapilFaceConfidence: 0.95,
      dukcapilVerified: true,
      entryPoint: "verified_account_center",
    },
    ...overrides,
  };
}

describe("submission ledger", () => {
  let ledger: Ledger;

  beforeEach(() => {
    ledger = makeInitialLedger(NOW, 420);
  });

  it("starts with exactly one approved initial KYC submission", () => {
    expect(ledger.submissions).toHaveLength(1);
    expect(approvedSubmission(ledger)?.type).toBe("initial_kyc");
    expect(reportedTier(ledger)).toBe("low");
    expect(canStartReKyc(ledger)).toBe(true);
  });

  it("supersedes the previously approved submission in the same transaction", () => {
    const previousId = approvedSubmission(ledger)!.id;
    const withNew = appendSubmission(ledger, reverification("sub_new"));

    const { ledger: next } = approveSubmission(withNew, "sub_new", { actor: "system", at: NOW });

    const previous = next.submissions.find((item) => item.id === previousId)!;
    expect(previous.status).toBe("rejected");
    expect(previous.rejectionReason).toBe("superseded_by_newer_approval");
    expect(previous.decidedBy).toBe("system");
    expect(approvedSubmission(next)?.id).toBe("sub_new");
    expect(() => assertAtMostOneApproved(next.submissions)).not.toThrow();
  });

  it("reads the data in use and the tier from the approved submission only", () => {
    const withNew = appendSubmission(ledger, reverification("sub_new"));
    const { ledger: next } = approveSubmission(withNew, "sub_new", { actor: "system", at: NOW });

    expect(identityInUse(next)).toEqual(UPDATED_IDENTITY);
    expect(reportedTier(next)).toBe("medium");
  });

  it("reports no tier when nothing is approved", () => {
    const approved = approvedSubmission(ledger)!;
    const { ledger: next } = rejectSubmission(ledger, approved.id, {
      actor: "agent",
      at: NOW,
      reason: "agent_rejected",
    });

    expect(reportedTier(next)).toBeNull();
    expect(identityInUse(next)).toBeNull();
  });

  it("downgrades the account when the approved submission is rejected, and promotes nothing", () => {
    const approved = approvedSubmission(ledger)!;
    const { ledger: next } = rejectSubmission(ledger, approved.id, {
      actor: "agent",
      at: NOW,
      reason: "agent_rejected",
    });

    expect(next.account.kycStatus).toBe("downgraded");
    expect(next.account.walletLevel).toBe("gopay_basic");
    expect(approvedSubmission(next)).toBeNull();
    expect(canStartReKyc(next)).toBe(false);
  });

  it("leaves everything untouched when a non-approved submission is rejected", () => {
    const withNew = appendSubmission(ledger, reverification("sub_new"));
    const { ledger: next } = rejectSubmission(withNew, "sub_new", {
      actor: "system",
      at: NOW,
      reason: "rekyc_id_mismatch",
    });

    expect(next.account).toEqual(ledger.account);
    expect(identityInUse(next)).toEqual(identityInUse(ledger));
    expect(next.partnerEvents).toHaveLength(0);
  });

  it("restores a downgraded account when a submission is approved", () => {
    const approved = approvedSubmission(ledger)!;
    const { ledger: downgraded } = rejectSubmission(ledger, approved.id, {
      actor: "agent",
      at: NOW,
      reason: "agent_rejected",
    });
    const withNew = appendSubmission(downgraded, reverification("sub_new"));

    const { ledger: next } = approveSubmission(withNew, "sub_new", { actor: "agent", at: NOW });

    expect(next.account.kycStatus).toBe("approved");
    expect(next.account.walletLevel).toBe("gopay_plus");
  });

  it("notifies every linked partner on approval without identity data", () => {
    const withNew = appendSubmission(ledger, reverification("sub_new"));
    const { ledger: next } = approveSubmission(withNew, "sub_new", { actor: "system", at: NOW });

    expect(next.partnerEvents).toHaveLength(ledger.account.linkedPartners.length);
    for (const event of next.partnerEvents) {
      expect(event.event).toBe("reverification.approved");
      expect(Object.keys(event)).toEqual(["id", "partner", "accountId", "event", "occurredAt"]);
    }
  });

  it("resets the ODD due date from the newly assessed tier", () => {
    const withNew = appendSubmission(ledger, reverification("sub_new", { riskTier: "high" }));
    const { ledger: next } = approveSubmission(withNew, "sub_new", { actor: "system", at: NOW });

    const due = new Date(next.account.oddDueAt);
    const expected = new Date(NOW);
    expected.setMonth(expected.getMonth() + 12);
    expect(due.toISOString()).toBe(expected.toISOString());
  });

  it("rejects edits to submission data", () => {
    const submission = reverification("sub_new");
    const tampered = { ...submission, data: { ...submission.data, fullName: "Someone Else" } };

    expect(() => assertSubmissionDataUnchanged(submission, tampered)).toThrow(LedgerConstraintError);
  });

  it("refuses to hold two approved submissions at once", () => {
    const forced = [
      ...ledger.submissions,
      reverification("sub_forced", { status: "approved" as const }),
    ];
    expect(() => assertAtMostOneApproved(forced)).toThrow(LedgerConstraintError);
  });

  it("creates no new submission when an agent changes a decision", () => {
    const withNew = appendSubmission(ledger, reverification("sub_new"));
    const { ledger: next } = overrideDecision(withNew, "sub_new", "approved", { at: NOW });

    expect(next.submissions).toHaveLength(withNew.submissions.length);
    expect(next.submissions.find((item) => item.id === "sub_new")?.data).toEqual(UPDATED_IDENTITY);
  });

  it("throws for an unknown submission", () => {
    expect(() => approveSubmission(ledger, "nope", { actor: "agent", at: NOW })).toThrow(
      LedgerConstraintError,
    );
  });
});
