import { describe, expect, it } from "vitest";
import { makeInitialLedger } from "@/data/account";
import { approvedSubmission, rejectSubmission } from "./ledger";
import { callbackPayload, eventsForPartner, pullApprovedData } from "./partners";

const NOW = "2026-09-21T03:00:00.000Z";

describe("partner integration", () => {
  it("returns the approved submission's data from the pull API", () => {
    const ledger = makeInitialLedger(NOW, 420);
    const response = pullApprovedData(ledger);

    expect(response.status).toBe("ok");
    if (response.status !== "ok") throw new Error("expected data");
    expect(response.data).toEqual(approvedSubmission(ledger)?.data);
  });

  it("returns a no-data response instead of stale data when nothing is approved", () => {
    const ledger = makeInitialLedger(NOW, 420);
    const approved = approvedSubmission(ledger)!;
    const { ledger: next } = rejectSubmission(ledger, approved.id, {
      actor: "agent",
      at: NOW,
      reason: "agent_rejected",
    });

    expect(pullApprovedData(next)).toEqual({
      status: "no_data",
      accountId: next.account.accountId,
      reason: "no_approved_submission",
    });
  });

  it("emits a revocation callback per partner when the approved submission is rejected", () => {
    const ledger = makeInitialLedger(NOW, 420);
    const approved = approvedSubmission(ledger)!;
    const { ledger: next } = rejectSubmission(ledger, approved.id, {
      actor: "agent",
      at: NOW,
      reason: "agent_rejected",
    });

    expect(next.partnerEvents).toHaveLength(ledger.account.linkedPartners.length);
    expect(eventsForPartner(next, "Merchant")).toHaveLength(1);
  });

  it("puts no identity data in the callback payload", () => {
    const ledger = makeInitialLedger(NOW, 420);
    const approved = approvedSubmission(ledger)!;
    const { ledger: next } = rejectSubmission(ledger, approved.id, {
      actor: "agent",
      at: NOW,
      reason: "agent_rejected",
    });
    const payload = callbackPayload(next.partnerEvents[0]!);

    expect(Object.keys(payload).sort()).toEqual(["account_id", "event", "occurred_at"]);
    expect(JSON.stringify(payload)).not.toContain(approved.data.nik);
  });
});
