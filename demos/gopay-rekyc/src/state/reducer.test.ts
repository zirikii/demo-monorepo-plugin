import { describe, expect, it } from "vitest";
import { UPDATED_IDENTITY } from "@/data/identity";
import { approvedSubmission, identityInUse } from "@/domain/ledger";
import { DEFAULT_SCENARIO, type Scenario } from "@/domain/scenario";
import { createInitialState, demoReducer } from "./reducer";
import type { DemoAction, DemoState } from "./types";

const NOW = "2026-09-21T03:00:00.000Z";

function drive(patch: Partial<Scenario>, actions: DemoAction[]): DemoState {
  const scenario: Scenario = { ...DEFAULT_SCENARIO, ...patch };
  return actions.reduce(demoReducer, createInitialState(NOW, scenario));
}

const RUN_FLOW: DemoAction[] = [
  { type: "startSession", entryPoint: "verified_account_center" },
  { type: "completeFr" },
  { type: "captureKtp" },
  { type: "runVerification" },
];

describe("re-KYC session flow", () => {
  it("approves, supersedes, notifies partners and queues the success notifications", () => {
    const state = drive({}, RUN_FLOW);

    const approved = approvedSubmission(state.ledger)!;
    expect(approved.type).toBe("reverification");
    expect(identityInUse(state.ledger)).toEqual(UPDATED_IDENTITY);
    expect(state.ledger.submissions).toHaveLength(2);
    expect(state.ledger.submissions[0]?.rejectionReason).toBe("superseded_by_newer_approval");
    expect(state.ledger.partnerEvents).toHaveLength(4);
    expect(state.toasts).toHaveLength(1);
    expect(state.genieVisible).toBe(true);
    expect(state.pushNotifications).toHaveLength(1);
  });

  it("reuses the FR selfie so the selfie screen is skipped", () => {
    const state = drive({}, RUN_FLOW.slice(0, 3));

    expect(state.session?.selfieSource).toBe("fr_reuse");
    expect(state.session?.selfieImageId).toBe(state.session?.frSelfieId);
  });

  it("requires a selfie capture when reuse is switched off", () => {
    const state = drive({ reuseFrSelfie: false }, RUN_FLOW.slice(0, 3));

    expect(state.session?.selfieSource).toBeNull();
    expect(state.session?.selfieImageId).toBeNull();
  });

  it("blocks capture when FR fails and leaves the ledger untouched", () => {
    const state = drive({ frMatchScore: 0.3 }, RUN_FLOW);

    expect(state.session?.frPassed).toBe(false);
    expect(state.session?.capturedIdentity).toBeNull();
    expect(state.ledger.submissions).toHaveLength(1);
    expect(state.ledger.account.kycStatus).toBe("approved");
  });

  it("writes a rejected submission for a NIK mismatch and changes nothing else", () => {
    const state = drive({ ocrNikMatchesOnFile: false }, RUN_FLOW);

    const rejected = state.ledger.submissions.at(-1)!;
    expect(rejected.status).toBe("rejected");
    expect(rejected.rejectionReason).toBe("rekyc_id_mismatch");
    expect(state.ledger.account.kycStatus).toBe("approved");
    expect(state.ledger.account.walletLevel).toBe("gopay_plus");
    expect(approvedSubmission(state.ledger)?.type).toBe("initial_kyc");
    expect(state.ledger.partnerEvents).toHaveLength(0);
  });

  it("keeps a low-confidence submission pending instead of deciding it", () => {
    const state = drive({ ocrConfidence: 0.4 }, RUN_FLOW);

    expect(state.ledger.submissions.at(-1)?.status).toBe("pending_review");
    expect(approvedSubmission(state.ledger)?.type).toBe("initial_kyc");
  });

  it("creates no submission until EDD is completed for a high-risk session", () => {
    const beforeEdd = drive({ riskTier: "high", riskScore: 82 }, RUN_FLOW);
    expect(beforeEdd.ledger.submissions).toHaveLength(1);
    expect(beforeEdd.session?.result?.decision).toEqual({ kind: "edd_required" });

    const afterEdd = [
      { type: "submitEdd", answers: { pep: "No" } } as DemoAction,
      { type: "runVerification" } as DemoAction,
    ].reduce(demoReducer, beforeEdd);

    expect(afterEdd.ledger.submissions).toHaveLength(2);
    expect(approvedSubmission(afterEdd.ledger)?.riskTier).toBe("high");
  });

  it("exiting the context screen starts nothing", () => {
    const state = drive({}, [{ type: "abandonSession" }]);

    expect(state.session).toBeNull();
    expect(state.ledger.submissions).toHaveLength(1);
    expect(state.ledger.account.kycStatus).toBe("approved");
  });

  it("lets an agent flip a pending submission to approved without creating a row", () => {
    const pending = drive({ ocrConfidence: 0.4 }, RUN_FLOW);
    const submissionId = pending.ledger.submissions.at(-1)!.id;

    const next = demoReducer(pending, {
      type: "overrideDecision",
      submissionId,
      status: "approved",
    });

    expect(next.ledger.submissions).toHaveLength(2);
    expect(approvedSubmission(next.ledger)?.id).toBe(submissionId);
    expect(next.ledger.submissions[0]?.rejectionReason).toBe("superseded_by_newer_approval");
  });

  it("moves the ODD due date when the scenario console changes it", () => {
    const state = drive({}, [{ type: "patchScenario", patch: { oddDueInDays: -45 } }]);

    expect(new Date(state.ledger.account.oddDueAt).getTime()).toBeLessThan(
      new Date(NOW).getTime(),
    );
  });
});

describe("resetting", () => {
  const CONFIGURED: DemoAction[] = [
    { type: "setLocale", locale: "en" },
    { type: "patchScenario", patch: { oddDueInDays: -45, ocrConfidence: 0.4 } },
    ...RUN_FLOW,
  ];

  it("clears the scenario as well as the ledger on a full reset", () => {
    const state = drive({}, [...CONFIGURED, { type: "resetDemo" }]);

    expect(state.scenario).toEqual(DEFAULT_SCENARIO);
    expect(state.ledger.submissions).toHaveLength(1);
    expect(state.session).toBeNull();
  });

  it("keeps the configured scenario when only the ledger is reset", () => {
    const state = drive({}, [...CONFIGURED, { type: "resetLedger" }]);

    expect(state.scenario.ocrConfidence).toBe(0.4);
    expect(state.scenario.oddDueInDays).toBe(-45);
    expect(state.ledger.submissions).toHaveLength(1);
  });

  it("leaves the chosen language alone so a reset does not switch the UI back", () => {
    const full = drive({}, [...CONFIGURED, { type: "resetDemo" }]);
    const ledgerOnly = drive({}, [...CONFIGURED, { type: "resetLedger" }]);

    expect(full.locale).toBe("en");
    expect(ledgerOnly.locale).toBe("en");
  });
});
