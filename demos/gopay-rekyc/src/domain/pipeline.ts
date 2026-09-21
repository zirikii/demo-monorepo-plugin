import type { Scenario } from "./scenario";
import type { EntryPoint, RejectionReason, SubmissionSystemDetails } from "./types";

export type PipelineStepId =
  | "fr_gate"
  | "capture"
  | "nik_match"
  | "ocr_confidence"
  | "name_screening"
  | "risk_scoring"
  | "edd"
  | "dukcapil"
  | "decision";

export type PipelineStepStatus = "passed" | "failed" | "skipped" | "waiting" | "not_reached";

export interface Bilingual {
  id: string;
  en: string;
}

export interface PipelineStep {
  id: PipelineStepId;
  status: PipelineStepStatus;
  label: Bilingual;
  detail: Bilingual;
}

export type PipelineDecision =
  | { kind: "approved" }
  | { kind: "rejected"; reason: RejectionReason }
  | { kind: "manual_review"; trigger: "low_ocr_confidence" | "name_screening_hit" }
  | { kind: "edd_required" };

export interface PipelineInput {
  scenario: Scenario;
  onFileNik: string;
  capturedNik: string;
  eddCompleted: boolean;
  entryPoint: EntryPoint;
}

export interface PipelineResult {
  steps: PipelineStep[];
  decision: PipelineDecision;
  system: SubmissionSystemDetails;
  /** True when Dukcapil returned a fresh verification, so the new record replaces the old one. */
  replacesIdentityData: boolean;
}

export function frPasses(scenario: Scenario): boolean {
  return scenario.frMatchScore >= scenario.thresholds.frMatch;
}

const STEP_ORDER: PipelineStepId[] = [
  "fr_gate",
  "capture",
  "nik_match",
  "ocr_confidence",
  "name_screening",
  "risk_scoring",
  "edd",
  "dukcapil",
  "decision",
];

const STEP_LABELS: Record<PipelineStepId, Bilingual> = {
  fr_gate: { id: "Verifikasi wajah (FR)", en: "Face recognition gate" },
  capture: { id: "Ambil foto e-KTP & selfie", en: "e-KTP and selfie capture" },
  nik_match: { id: "Pencocokan NIK lokal", en: "Local NIK match" },
  ocr_confidence: { id: "Keyakinan OCR", en: "OCR confidence" },
  name_screening: { id: "Name screening", en: "Name screening" },
  risk_scoring: { id: "Penilaian risiko", en: "Risk scoring" },
  edd: { id: "Enhanced Due Diligence", en: "Enhanced Due Diligence" },
  dukcapil: { id: "Verifikasi Dukcapil", en: "Dukcapil verification" },
  decision: { id: "Keputusan", en: "Decision" },
};

function makeSteps(): Map<PipelineStepId, PipelineStep> {
  const map = new Map<PipelineStepId, PipelineStep>();
  for (const id of STEP_ORDER) {
    map.set(id, {
      id,
      status: "not_reached",
      label: STEP_LABELS[id],
      detail: { id: "Belum dijalankan", en: "Not reached" },
    });
  }
  return map;
}

function setStep(
  steps: Map<PipelineStepId, PipelineStep>,
  id: PipelineStepId,
  status: PipelineStepStatus,
  detail: Bilingual,
): void {
  const existing = steps.get(id);
  if (!existing) return;
  steps.set(id, { ...existing, status, detail });
}

/**
 * The verification sequence from PRD 4.2 "KTP and Selfie capture flow", in the order the PRD lists
 * it: NIK match is evaluated before the OCR confidence gate, so a mismatch rejects locally even
 * when the read was low confidence and no Dukcapil call is made.
 */
export function runPipeline(input: PipelineInput): PipelineResult {
  const { scenario } = input;
  const steps = makeSteps();

  const system: SubmissionSystemDetails = {
    frMatchScore: scenario.frMatchScore,
    ocrConfidence: scenario.ocrConfidence,
    nikMatchedOnFile: input.capturedNik === input.onFileNik,
    nameScreeningHit: scenario.nameScreeningHit,
    riskScoringCacheUsed: false,
    eddRequired: scenario.riskTier === "high",
    eddCompleted: input.eddCompleted,
    dukcapilSource: "not_called",
    dukcapilFaceConfidence: null,
    dukcapilVerified: null,
    entryPoint: input.entryPoint,
  };

  const finish = (
    decision: PipelineDecision,
    replacesIdentityData = false,
  ): PipelineResult => ({
    steps: STEP_ORDER.map((id) => steps.get(id)!),
    decision,
    system,
    replacesIdentityData,
  });

  if (!frPasses(scenario)) {
    setStep(steps, "fr_gate", "failed", {
      id: `Skor kecocokan ${scenario.frMatchScore.toFixed(2)} di bawah ambang ${scenario.thresholds.frMatch}`,
      en: `Match score ${scenario.frMatchScore.toFixed(2)} below the ${scenario.thresholds.frMatch} threshold`,
    });
    setStep(steps, "decision", "failed", {
      id: "Sesi dihentikan sebelum pengambilan e-KTP. Data lama tidak berubah.",
      en: "Session stopped before e-KTP capture. The on-file record is untouched.",
    });
    return finish({ kind: "rejected", reason: "rekyc_fr_failed" });
  }

  setStep(steps, "fr_gate", "passed", {
    id: `Wajah cocok (${scenario.frMatchScore.toFixed(2)}) dengan rekaman wajah tersimpan`,
    en: `Live selfie matched the on-file face record (${scenario.frMatchScore.toFixed(2)})`,
  });

  setStep(steps, "capture", "passed", {
    id: scenario.reuseFrSelfie
      ? "Foto e-KTP diambil. Selfie memakai ulang foto dari FR."
      : "Foto e-KTP dan selfie diambil.",
    en: scenario.reuseFrSelfie
      ? "e-KTP captured. Selfie reused from the FR challenge."
      : "e-KTP and selfie captured.",
  });

  if (!system.nikMatchedOnFile) {
    setStep(steps, "nik_match", "failed", {
      id: "NIK hasil OCR tidak sama dengan NIK terdaftar",
      en: "OCR NIK does not match the account's on-file NIK",
    });
    setStep(steps, "dukcapil", "skipped", {
      id: "Tidak dipanggil — ditolak secara lokal",
      en: "Not called — rejected locally",
    });
    setStep(steps, "decision", "failed", {
      id: "Ditolak: rekyc_id_mismatch",
      en: "Rejected: rekyc_id_mismatch",
    });
    return finish({ kind: "rejected", reason: "rekyc_id_mismatch" });
  }

  setStep(steps, "nik_match", "passed", {
    id: "NIK hasil OCR sama dengan NIK terdaftar",
    en: "OCR NIK matches the account's on-file NIK",
  });

  if (scenario.ocrConfidence < scenario.thresholds.ocrConfidence) {
    setStep(steps, "ocr_confidence", "failed", {
      id: `Keyakinan OCR ${scenario.ocrConfidence.toFixed(2)} di bawah ambang ${scenario.thresholds.ocrConfidence}`,
      en: `OCR confidence ${scenario.ocrConfidence.toFixed(2)} below the ${scenario.thresholds.ocrConfidence} threshold`,
    });
    setStep(steps, "decision", "waiting", {
      id: "Masuk antrean pemeriksaan manual — status menunggu, bukan penolakan",
      en: "Routed to the manual review queue — pending, not rejected",
    });
    return finish({ kind: "manual_review", trigger: "low_ocr_confidence" });
  }

  setStep(steps, "ocr_confidence", "passed", {
    id: `Keyakinan OCR ${scenario.ocrConfidence.toFixed(2)} memenuhi ambang`,
    en: `OCR confidence ${scenario.ocrConfidence.toFixed(2)} meets the threshold`,
  });

  if (scenario.nameScreeningHit) {
    setStep(steps, "name_screening", "failed", {
      id: "Ada kecocokan pada daftar screening — diteruskan ke agen",
      en: "Screening list hit — handed to an agent",
    });
    setStep(steps, "decision", "waiting", {
      id: "Masuk antrean pemeriksaan manual",
      en: "Routed to the manual review queue",
    });
    return finish({ kind: "manual_review", trigger: "name_screening_hit" });
  }

  setStep(steps, "name_screening", "passed", {
    id: "Tidak ada kecocokan pada daftar screening",
    en: "No screening list hit",
  });

  setStep(steps, "risk_scoring", "passed", {
    id: `Skor risiko baru ${scenario.riskScore} (${scenario.riskTier}) — tanpa memakai hasil lama`,
    en: `Fresh risk score ${scenario.riskScore} (${scenario.riskTier}) — no cached result reused`,
  });

  if (system.eddRequired && !input.eddCompleted) {
    setStep(steps, "edd", "waiting", {
      id: "Risiko tinggi — EDD wajib diisi sebelum sesi dapat disetujui",
      en: "High risk — EDD must be completed before the session can be approved",
    });
    return finish({ kind: "edd_required" });
  }

  setStep(
    steps,
    "edd",
    system.eddRequired ? "passed" : "skipped",
    system.eddRequired
      ? { id: "EDD selesai", en: "EDD completed" }
      : { id: "Tidak diperlukan untuk risiko ini", en: "Not required at this risk tier" },
  );

  const cacheHit = scenario.dukcapilFaceConfidence >= scenario.thresholds.dukcapilFaceConfidence;
  system.dukcapilFaceConfidence = scenario.dukcapilFaceConfidence;

  if (cacheHit) {
    system.dukcapilSource = "cache";
    system.dukcapilVerified = true;
    setStep(steps, "dukcapil", "passed", {
      id: `Cache Dukcapil cocok (${scenario.dukcapilFaceConfidence.toFixed(2)}) — verifikasi ulang dilewati`,
      en: `Dukcapil cache matched (${scenario.dukcapilFaceConfidence.toFixed(2)}) — re-verification skipped`,
    });
    setStep(steps, "decision", "passed", {
      id: "Disetujui",
      en: "Approved",
    });
    return finish({ kind: "approved" }, false);
  }

  system.dukcapilSource = "live";
  system.dukcapilVerified = scenario.dukcapilVerified;

  if (!scenario.dukcapilVerified) {
    setStep(steps, "dukcapil", "failed", {
      id: `Verifikasi ulang Dukcapil gagal (${scenario.dukcapilFaceConfidence.toFixed(2)})`,
      en: `Dukcapil re-verification failed (${scenario.dukcapilFaceConfidence.toFixed(2)})`,
    });
    setStep(steps, "decision", "failed", {
      id: "Percobaan re-KYC ditolak. Status GoPay Plus tidak diturunkan.",
      en: "re-KYC attempt rejected. GoPay Plus is not downgraded.",
    });
    return finish({ kind: "rejected", reason: "rekyc_dukcapil_not_verified" });
  }

  setStep(steps, "dukcapil", "passed", {
    id: "Verifikasi ulang Dukcapil berhasil — data lama diganti data baru",
    en: "Dukcapil re-verification succeeded — the new data replaces the old record",
  });
  setStep(steps, "decision", "passed", { id: "Disetujui", en: "Approved" });
  return finish({ kind: "approved" }, true);
}
