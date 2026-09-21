export type Locale = "id" | "en";

/** Account-level KYC status. re-KYC is only offered while this is `approved`. */
export type AccountKycStatus = "approved" | "downgraded";

export type WalletLevel = "gopay_plus" | "gopay_basic";

export type SubmissionType = "initial_kyc" | "reverification";

export type SubmissionStatus = "approved" | "rejected" | "pending_review";

export type RiskTier = "low" | "medium" | "high";

export type RejectionReason =
  | "rekyc_id_mismatch"
  | "rekyc_dukcapil_not_verified"
  | "rekyc_fr_failed"
  | "superseded_by_newer_approval"
  | "agent_rejected";

export type DecisionActor = "system" | "agent";

export interface IdentityData {
  nik: string;
  fullName: string;
  placeOfBirth: string;
  dateOfBirth: string;
  address: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  religion: string;
  gender: string;
  maritalStatus: string;
  occupation: string;
  nationality: string;
}

export type IdentityField = keyof IdentityData;

export type SelfieSource = "fr_reuse" | "selfie_capture";

export interface SubmissionDocuments {
  ktpImageId: string;
  selfieImageId: string;
  selfieSource: SelfieSource;
}

export interface SubmissionSystemDetails {
  frMatchScore: number | null;
  ocrConfidence: number;
  nikMatchedOnFile: boolean;
  nameScreeningHit: boolean;
  riskScoringCacheUsed: boolean;
  eddRequired: boolean;
  eddCompleted: boolean;
  dukcapilSource: "cache" | "live" | "not_called";
  dukcapilFaceConfidence: number | null;
  dukcapilVerified: boolean | null;
  entryPoint: EntryPoint;
}

export type EntryPoint = "verified_account_center" | "dira" | "odd_reminder" | "onboarding";

/**
 * One row per attempt. `data` and `documents` are never edited after creation — only `status`,
 * `decidedAt`, `decidedBy` and `rejectionReason` may change (PRD 4.3.1).
 */
export interface Submission {
  id: string;
  accountId: string;
  type: SubmissionType;
  status: SubmissionStatus;
  submittedAt: string;
  decidedAt: string | null;
  decidedBy: DecisionActor | null;
  rejectionReason: RejectionReason | null;
  data: IdentityData;
  documents: SubmissionDocuments;
  riskScore: number;
  riskTier: RiskTier;
  system: SubmissionSystemDetails;
}

export interface KycAccount {
  accountId: string;
  displayName: string;
  phone: string;
  email: string;
  kycStatus: AccountKycStatus;
  walletLevel: WalletLevel;
  oddLastReviewAt: string;
  oddDueAt: string;
  linkedPartners: string[];
}

export type PartnerEventType =
  | "reverification.approved"
  | "reverification.revoked"
  | "kyc.downgraded";

/** Callback payload carries the account identifier, what happened, and when — no identity data. */
export interface PartnerEvent {
  id: string;
  partner: string;
  accountId: string;
  event: PartnerEventType;
  occurredAt: string;
}

export interface Ledger {
  account: KycAccount;
  submissions: Submission[];
  partnerEvents: PartnerEvent[];
}
