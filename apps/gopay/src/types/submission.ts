export type SubmissionType = "initial_kyc" | "reverification";

export type SubmissionStatus = "approved" | "rejected" | "pending";

export type RejectionReason =
  | "rekyc_id_mismatch"
  | "dukcapil_not_verified"
  | "fr_failed"
  | "superseded_by_newer_approval"
  | "agent_override"
  | "high_risk_rejected";

export type RiskTier = "low" | "medium" | "high";

export type Submission = {
  id: string;
  accountId: string;
  type: SubmissionType;
  status: SubmissionStatus;
  reason?: RejectionReason;
  riskScore: number;
  riskTier: RiskTier;
  ocrConfidence: number;
  dukcapilConfidence: number;
  documents: {
    ktpUrl: string;
    selfieUrl: string;
  };
  submittedAt: string;
  decidedAt?: string;
  level1: string;
  level2: string;
  systemDetails: string;
  identity: import("./identity").IdentityRecord;
};
