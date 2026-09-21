import type { IdentityRecord } from "./identity";
import type { RiskTier, Submission } from "./submission";

export type KycStatus = "approved" | "downgraded";

export type Account = {
  id: string;
  email: string;
  phone: string;
  displayName: string;
  kycStatus: KycStatus;
  balanceIdr: number;
  oddDueAt: string;
  lastFrAt?: string;
  identityOnFile: IdentityRecord;
};

export type PartnerCallback = {
  id: string;
  partner: string;
  accountId: string;
  event: "reverification_approved" | "reverification_unapproved";
  timestamp: string;
};

export type StoreSnapshot = {
  account: Account;
  submissions: Submission[];
  callbacks: PartnerCallback[];
  notifications: { id: string; channel: "push" | "genie"; body: string; read: boolean }[];
  toast?: string;
  blockEnforcement: boolean;
  blockRiskScope: RiskTier[];
  blockOverdueDays: number;
  oddBannerLeadDays: number;
};
