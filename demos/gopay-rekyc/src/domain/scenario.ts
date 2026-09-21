import type { BlockEnforcementConfig } from "./odd";
import type { EntryPoint, RiskTier } from "./types";

/** Thresholds the pipeline compares against. Configurable so every branch is demoable. */
export interface Thresholds {
  frMatch: number;
  ocrConfidence: number;
  dukcapilFaceConfidence: number;
}

export const DEFAULT_THRESHOLDS: Thresholds = {
  frMatch: 0.85,
  ocrConfidence: 0.8,
  dukcapilFaceConfidence: 0.9,
};

/** Every simulated external system, driven from the scenario console. */
export interface Scenario {
  frMatchScore: number;
  reuseFrSelfie: boolean;
  ocrNikMatchesOnFile: boolean;
  ocrConfidence: number;
  nameScreeningHit: boolean;
  riskTier: RiskTier;
  riskScore: number;
  dukcapilFaceConfidence: number;
  dukcapilVerified: boolean;
  thresholds: Thresholds;
  block: BlockEnforcementConfig;
  entryPoint: EntryPoint;
  oddDueInDays: number;
  /**
   * PRD 4.2 specifies the "this e-KTP is not mine" report, while the 26 Aug meeting notes say to
   * drop it from scope. Both readings are demoable from here.
   */
  notMineEntryEnabled: boolean;
}

export const DEFAULT_SCENARIO: Scenario = {
  frMatchScore: 0.94,
  reuseFrSelfie: true,
  ocrNikMatchesOnFile: true,
  ocrConfidence: 0.96,
  nameScreeningHit: false,
  riskTier: "low",
  riskScore: 18,
  dukcapilFaceConfidence: 0.95,
  dukcapilVerified: true,
  thresholds: DEFAULT_THRESHOLDS,
  block: { enabled: false, scopeTiers: ["high"], scopeDaysPastDue: 30 },
  entryPoint: "verified_account_center",
  oddDueInDays: 420,
  notMineEntryEnabled: true,
};

export interface ScenarioPreset {
  id: string;
  label: string;
  description: string;
  patch: Partial<Scenario>;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "happy",
    label: "Happy path — low risk, Dukcapil cache hit",
    description:
      "FR passes, OCR NIK matches, low risk, Dukcapil face confidence above threshold so the cached record is reused.",
    patch: {
      frMatchScore: 0.94,
      ocrNikMatchesOnFile: true,
      ocrConfidence: 0.96,
      nameScreeningHit: false,
      riskTier: "low",
      riskScore: 18,
      dukcapilFaceConfidence: 0.95,
      dukcapilVerified: true,
    },
  },
  {
    id: "dukcapil-rerun",
    label: "Dukcapil re-run — verified",
    description:
      "Face confidence falls below the threshold, Dukcapil verification re-runs and confirms, so the new data replaces the old.",
    patch: { dukcapilFaceConfidence: 0.72, dukcapilVerified: true },
  },
  {
    id: "dukcapil-reject",
    label: "Dukcapil re-run — not verified",
    description: "Dukcapil re-run fails. The attempt is rejected; GoPay Plus is not downgraded.",
    patch: { dukcapilFaceConfidence: 0.68, dukcapilVerified: false },
  },
  {
    id: "nik-mismatch",
    label: "NIK mismatch — local reject",
    description:
      "OCR reads a NIK that differs from the one on file. Rejected locally as rekyc_id_mismatch with no Dukcapil call.",
    patch: { ocrNikMatchesOnFile: false },
  },
  {
    id: "low-ocr",
    label: "Low OCR confidence — manual review",
    description: "OCR confidence below threshold routes the session to the manual review queue.",
    patch: { ocrConfidence: 0.54, ocrNikMatchesOnFile: true },
  },
  {
    id: "high-risk-edd",
    label: "High risk — EDD required",
    description: "Fresh risk scoring returns high risk, so EDD must be completed before approval.",
    patch: { riskTier: "high", riskScore: 82, nameScreeningHit: false },
  },
  {
    id: "screening-hit",
    label: "Name screening hit — manual review",
    description: "A screening hit sends the submission to an agent instead of auto-deciding.",
    patch: { nameScreeningHit: true, riskTier: "medium", riskScore: 55 },
  },
  {
    id: "fr-fail",
    label: "FR gate fails",
    description: "The liveness match is below threshold — KTP capture is never reached.",
    patch: { frMatchScore: 0.41 },
  },
  {
    id: "odd-block",
    label: "Phase 2 — overdue and blocked",
    description:
      "ODD is 45 days overdue with enforcement on for high-risk accounts past 30 days, so the app is blocked.",
    patch: {
      oddDueInDays: -45,
      riskTier: "high",
      riskScore: 78,
      block: { enabled: true, scopeTiers: ["high"], scopeDaysPastDue: 30 },
    },
  },
];
