import type { IdentityRecord } from "@/types/identity";
import type { Account, PartnerCallback } from "@/types/account";
import type { RejectionReason, RiskTier, Submission } from "@/types/submission";
import type { DemoScenario, RekycDecision, RekycSession } from "@/types/rekyc";
import { assertNever } from "@/lib/format";

export const NIK_MISMATCH = {
  code: "rekyc_id_mismatch" as const,
  en: "Because eKTP did not match with the current eKTP that registered. Please resubmit and ensure you use the same eKTP.",
  id: "Soalnya eKTP kamu tidak sesuai dengan eKTP yang terdaftar saat ini. Mohon submit ulang dan gunakan eKTP yang sama dengan yang sekarang terdaftar.",
};

export const OCR_PENDING_THRESHOLD = 0.72;
export const DUKCAPIL_CACHE_THRESHOLD = 0.85;

export type RekycEngineInput = {
  account: Account;
  session: RekycSession;
  scenario: DemoScenario;
  proposedIdentity: IdentityRecord;
  now?: string;
};

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function scoreForTier(tier: RiskTier): number {
  switch (tier) {
    case "high":
      return 88;
    case "medium":
      return 54;
    case "low":
      return 18;
    default: {
      const _exhaustive: never = tier;
      return assertNever(_exhaustive);
    }
  }
}

export function evaluateRekyc(input: RekycEngineInput): RekycDecision {
  const { session, scenario } = input;
  if (!session.frPassedAt) {
    return { kind: "fr_failed" };
  }
  if (!scenario.frPass) {
    return { kind: "fr_failed" };
  }
  const capturedNik = scenario.capturedNik;
  if (capturedNik !== input.account.identityOnFile.nik) {
    return { kind: "nik_mismatch", reason: "rekyc_id_mismatch" };
  }
  if (scenario.ocrConfidence < OCR_PENDING_THRESHOLD) {
    return { kind: "pending_review", ocrConfidence: scenario.ocrConfidence };
  }
  if (scenario.riskTier === "high" && !session.eddAnswers) {
    return { kind: "edd_required", riskTier: "high" };
  }
  if (scenario.dukcapilCacheConfidence >= DUKCAPIL_CACHE_THRESHOLD) {
    return { kind: "approved", reusedDukcapilCache: true };
  }
  if (scenario.dukcapilRerunVerified) {
    return { kind: "approved", reusedDukcapilCache: false };
  }
  return { kind: "dukcapil_rejected" };
}

export type ApplyResult = {
  account: Account;
  submissions: Submission[];
  callbacks: PartnerCallback[];
  toast?: string;
  notifications: { id: string; channel: "push" | "genie"; body: string; read: boolean }[];
};

export function applyDecision(opts: {
  account: Account;
  submissions: Submission[];
  callbacks: PartnerCallback[];
  notifications: ApplyResult["notifications"];
  decision: RekycDecision;
  proposedIdentity: IdentityRecord;
  scenario: DemoScenario;
  now?: string;
}): ApplyResult {
  const now = opts.now ?? new Date().toISOString();
  const { decision } = opts;

  switch (decision.kind) {
    case "no_session":
    case "fr_failed":
      return {
        account: opts.account,
        submissions: opts.submissions,
        callbacks: opts.callbacks,
        notifications: opts.notifications,
      };
    case "nik_mismatch":
      return appendRejected(opts, now, "rekyc_id_mismatch", "NIK mismatch — Dukcapil skipped");
    case "pending_review":
      return appendPending(opts, now);
    case "edd_required":
      return {
        account: opts.account,
        submissions: opts.submissions,
        callbacks: opts.callbacks,
        notifications: opts.notifications,
      };
    case "dukcapil_rejected":
      return appendRejected(opts, now, "dukcapil_not_verified", "Dukcapil not verified — Plus unchanged");
    case "approved":
      return approve(opts, now, decision.reusedDukcapilCache);
    default: {
      const _exhaustive: never = decision;
      return assertNever(_exhaustive);
    }
  }
}

function baseSubmission(
  opts: Parameters<typeof applyDecision>[0],
  now: string,
  extra: Partial<Submission>,
): Submission {
  const score = scoreForTier(opts.scenario.riskTier);
  return {
    id: newId("sub"),
    accountId: opts.account.id,
    type: "reverification",
    status: "pending",
    riskScore: score,
    riskTier: opts.scenario.riskTier,
    ocrConfidence: opts.scenario.ocrConfidence,
    dukcapilConfidence: opts.scenario.dukcapilCacheConfidence,
    documents: {
      ktpUrl: "/brand/mark.svg",
      selfieUrl: "/brand/mark.svg",
    },
    submittedAt: now,
    level1: "System auto",
    level2: "—",
    systemDetails: extra.systemDetails ?? "",
    identity: opts.proposedIdentity,
    ...extra,
  };
}

function appendRejected(
  opts: Parameters<typeof applyDecision>[0],
  now: string,
  reason: RejectionReason,
  systemDetails: string,
): ApplyResult {
  const row = baseSubmission(opts, now, {
    status: "rejected",
    reason,
    decidedAt: now,
    systemDetails,
  });
  return {
    account: opts.account,
    submissions: [...opts.submissions, row],
    callbacks: opts.callbacks,
    notifications: opts.notifications,
  };
}

function appendPending(opts: Parameters<typeof applyDecision>[0], now: string): ApplyResult {
  const row = baseSubmission(opts, now, {
    status: "pending",
    systemDetails: `OCR confidence ${opts.scenario.ocrConfidence} below threshold — manual review`,
  });
  return {
    account: opts.account,
    submissions: [...opts.submissions, row],
    callbacks: opts.callbacks,
    notifications: opts.notifications,
  };
}

function approve(
  opts: Parameters<typeof applyDecision>[0],
  now: string,
  reusedCache: boolean,
): ApplyResult {
  const alreadyApproved = opts.submissions.some((s) => s.status === "approved");
  const superseded = opts.submissions.map((s) =>
    s.status === "approved"
      ? {
          ...s,
          status: "rejected" as const,
          reason: "superseded_by_newer_approval" as const,
          decidedAt: now,
        }
      : s,
  );
  const row = baseSubmission(opts, now, {
    status: "approved",
    decidedAt: now,
    systemDetails: reusedCache
      ? "Dukcapil cache above threshold — reused prior data match"
      : "Dukcapil re-run verified — identity replaced",
  });
  if (!alreadyApproved) {
    /* first approval on a downgraded account restores KYC in the same transaction */
  }
  const callbacks: PartnerCallback[] = [
    ...opts.callbacks,
    {
      id: newId("cb"),
      partner: "OneKYC",
      accountId: opts.account.id,
      event: "reverification_approved",
      timestamp: now,
    },
    {
      id: newId("cb"),
      partner: "Pinjam",
      accountId: opts.account.id,
      event: "reverification_approved",
      timestamp: now,
    },
    {
      id: newId("cb"),
      partner: "Merchant",
      accountId: opts.account.id,
      event: "reverification_approved",
      timestamp: now,
    },
  ];
  const notifications = [
    ...opts.notifications,
    {
      id: newId("n"),
      channel: "push" as const,
      body: "Data KYC diperbarui — akunmu udah aktif lagi. Yuk transaksi seperti biasa.",
      read: false,
    },
    {
      id: newId("n"),
      channel: "genie" as const,
      body: "Data KYC kamu sudah diperbarui ✅",
      read: false,
    },
  ];
  return {
    account: {
      ...opts.account,
      kycStatus: "approved",
      identityOnFile: opts.proposedIdentity,
      oddDueAt: nextOddDue(now, opts.scenario.riskTier),
    },
    submissions: [...superseded, row],
    callbacks,
    notifications,
    toast: "Data KYC kamu sudah diperbarui ✅",
  };
}

export function nextOddDue(fromIso: string, tier: RiskTier): string {
  const d = new Date(fromIso);
  const months = tier === "high" ? 6 : tier === "medium" ? 12 : 24;
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

export function overrideSubmissionStatus(
  submissions: Submission[],
  id: string,
  status: Submission["status"],
  reason?: RejectionReason,
): Submission[] {
  return submissions.map((s) =>
    s.id === id
      ? { ...s, status, reason: status === "rejected" ? (reason ?? "agent_override") : undefined }
      : s,
  );
}

export function riskTierOfAccount(submissions: Submission[]): RiskTier | null {
  const approved = submissions.find((s) => s.status === "approved");
  return approved ? approved.riskTier : null;
}
