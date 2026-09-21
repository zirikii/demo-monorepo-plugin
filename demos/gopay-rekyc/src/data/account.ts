import { resetOddInterval } from "@/domain/odd";
import type { KycAccount, Ledger, Submission } from "@/domain/types";
import { ON_FILE_IDENTITY } from "./identity";

export const LINKED_PARTNERS = ["SNI GoPay ID", "Merchant", "GoPay Pinjam", "Driver Wallet"];

const INITIAL_KYC_AT = "2022-03-18T04:12:00.000Z";

export const INITIAL_SUBMISSION: Submission = {
  id: "sub_initial_kyc",
  accountId: "acc_8891207734",
  type: "initial_kyc",
  status: "approved",
  submittedAt: INITIAL_KYC_AT,
  decidedAt: INITIAL_KYC_AT,
  decidedBy: "system",
  rejectionReason: null,
  data: ON_FILE_IDENTITY,
  documents: {
    ktpImageId: "img_ktp_2022_0318",
    selfieImageId: "img_selfie_2022_0318",
    selfieSource: "selfie_capture",
  },
  riskScore: 22,
  riskTier: "low",
  system: {
    frMatchScore: null,
    ocrConfidence: 0.93,
    nikMatchedOnFile: true,
    nameScreeningHit: false,
    riskScoringCacheUsed: false,
    eddRequired: false,
    eddCompleted: false,
    dukcapilSource: "live",
    dukcapilFaceConfidence: 0.91,
    dukcapilVerified: true,
    entryPoint: "onboarding",
  },
};

export function makeAccount(nowIso: string, oddDueInDays: number): KycAccount {
  const due = new Date(nowIso);
  due.setDate(due.getDate() + oddDueInDays);
  return {
    accountId: "acc_8891207734",
    displayName: "Rani Puspita Dewi",
    phone: "+62 812-8890-4471",
    email: "rani.pd@example.co.id",
    kycStatus: "approved",
    walletLevel: "gopay_plus",
    oddLastReviewAt: INITIAL_KYC_AT,
    oddDueAt: due.toISOString(),
    linkedPartners: LINKED_PARTNERS,
  };
}

export function makeInitialLedger(nowIso: string, oddDueInDays: number): Ledger {
  const account = makeAccount(nowIso, oddDueInDays);
  return {
    account: {
      ...account,
      oddDueAt: oddDueInDays === 0 ? resetOddInterval(INITIAL_KYC_AT, "low") : account.oddDueAt,
    },
    submissions: [INITIAL_SUBMISSION],
    partnerEvents: [],
  };
}
