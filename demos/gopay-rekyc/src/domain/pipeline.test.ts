import { describe, expect, it } from "vitest";
import { DEFAULT_SCENARIO, type Scenario } from "./scenario";
import { frPasses, runPipeline, type PipelineResult } from "./pipeline";

const ON_FILE_NIK = "3174094509900007";

function run(patch: Partial<Scenario> = {}, options: Partial<{ capturedNik: string; edd: boolean }> = {}) {
  const scenario: Scenario = { ...DEFAULT_SCENARIO, ...patch };
  return runPipeline({
    scenario,
    onFileNik: ON_FILE_NIK,
    capturedNik: options.capturedNik ?? ON_FILE_NIK,
    eddCompleted: options.edd ?? false,
    entryPoint: "verified_account_center",
  });
}

function step(result: PipelineResult, id: string) {
  return result.steps.find((item) => item.id === id)!;
}

describe("verification pipeline", () => {
  it("approves the happy path and reuses the Dukcapil cache", () => {
    const result = run();

    expect(result.decision).toEqual({ kind: "approved" });
    expect(result.system.dukcapilSource).toBe("cache");
    expect(result.replacesIdentityData).toBe(false);
  });

  it("never reaches capture when FR fails", () => {
    const scenario = { ...DEFAULT_SCENARIO, frMatchScore: 0.4 };
    expect(frPasses(scenario)).toBe(false);

    const result = run({ frMatchScore: 0.4 });
    expect(result.decision).toEqual({ kind: "rejected", reason: "rekyc_fr_failed" });
    expect(step(result, "capture").status).toBe("not_reached");
    expect(result.system.dukcapilSource).toBe("not_called");
  });

  it("rejects a NIK mismatch locally without calling Dukcapil", () => {
    const result = run({}, { capturedNik: "3276015208930012" });

    expect(result.decision).toEqual({ kind: "rejected", reason: "rekyc_id_mismatch" });
    expect(step(result, "dukcapil").status).toBe("skipped");
    expect(result.system.dukcapilSource).toBe("not_called");
    expect(result.system.nikMatchedOnFile).toBe(false);
  });

  it("routes a low-confidence read to manual review rather than rejecting", () => {
    const result = run({ ocrConfidence: 0.5 });

    expect(result.decision).toEqual({ kind: "manual_review", trigger: "low_ocr_confidence" });
    expect(step(result, "decision").status).toBe("waiting");
  });

  it("evaluates the NIK match before the confidence gate, as the PRD lists it", () => {
    const result = run({ ocrConfidence: 0.2 }, { capturedNik: "3276015208930012" });

    expect(result.decision).toEqual({ kind: "rejected", reason: "rekyc_id_mismatch" });
  });

  it("hands a screening hit to an agent", () => {
    const result = run({ nameScreeningHit: true });

    expect(result.decision).toEqual({ kind: "manual_review", trigger: "name_screening_hit" });
    expect(step(result, "risk_scoring").status).toBe("not_reached");
  });

  it("always scores risk fresh", () => {
    expect(run().system.riskScoringCacheUsed).toBe(false);
  });

  it("requires EDD for a high-risk session before it can be approved", () => {
    const pending = run({ riskTier: "high", riskScore: 82 });
    expect(pending.decision).toEqual({ kind: "edd_required" });
    expect(step(pending, "dukcapil").status).toBe("not_reached");

    const completed = run({ riskTier: "high", riskScore: 82 }, { edd: true });
    expect(completed.decision).toEqual({ kind: "approved" });
    expect(completed.system.eddRequired).toBe(true);
    expect(completed.system.eddCompleted).toBe(true);
  });

  it("re-runs Dukcapil below the confidence threshold and replaces the data when verified", () => {
    const result = run({ dukcapilFaceConfidence: 0.7, dukcapilVerified: true });

    expect(result.decision).toEqual({ kind: "approved" });
    expect(result.system.dukcapilSource).toBe("live");
    expect(result.replacesIdentityData).toBe(true);
  });

  it("rejects the attempt when the Dukcapil re-run fails", () => {
    const result = run({ dukcapilFaceConfidence: 0.7, dukcapilVerified: false });

    expect(result.decision).toEqual({ kind: "rejected", reason: "rekyc_dukcapil_not_verified" });
    expect(result.system.dukcapilVerified).toBe(false);
  });

  it("records that the selfie came from the FR challenge", () => {
    const reused = run({ reuseFrSelfie: true });
    expect(step(reused, "capture").detail.en).toContain("reused");

    const captured = run({ reuseFrSelfie: false });
    expect(step(captured, "capture").detail.en).not.toContain("reused");
  });
});
