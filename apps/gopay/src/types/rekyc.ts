import type { IdentityRecord } from "./identity";
import type { RejectionReason, RiskTier } from "./submission";

export type DemoScenario = {
  frPass: boolean;
  capturedNik: string;
  ocrConfidence: number;
  riskTier: RiskTier;
  dukcapilCacheConfidence: number;
  dukcapilRerunVerified: boolean;
};

export type RekycSession = {
  id: string;
  startedAt: string;
  frPassedAt?: string;
  frSelfieDataUrl?: string;
  capturedNik?: string;
  capturedIdentity?: IdentityRecord;
  eddAnswers?: Record<string, string>;
};

export type RekycDecision =
  | { kind: "no_session" }
  | { kind: "fr_failed" }
  | { kind: "nik_mismatch"; reason: Extract<RejectionReason, "rekyc_id_mismatch"> }
  | { kind: "pending_review"; ocrConfidence: number }
  | { kind: "edd_required"; riskTier: "high" }
  | { kind: "dukcapil_rejected" }
  | { kind: "approved"; reusedDukcapilCache: boolean };

export type CaptureCopyContext = "kyc" | "rekyc";
