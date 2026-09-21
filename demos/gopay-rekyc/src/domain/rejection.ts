import type { Bilingual } from "./pipeline";
import type { RejectionReason } from "./types";

/** Rejection copy is keyed by reason code so the portal and the app show the same wording. */
export const REJECTION_COPY: Record<RejectionReason, Bilingual> = {
  rekyc_id_mismatch: {
    en: "Because eKTP did not match with the current eKTP that registered. Please resubmit and ensure you use the same eKTP.",
    id: "Soalnya eKTP kamu tidak sesuai dengan eKTP yang terdaftar saat ini. Mohon submit ulang dan gunakan eKTP yang sama dengan yang sekarang terdaftar.",
  },
  rekyc_dukcapil_not_verified: {
    en: "Dukcapil could not verify the data on your new e-KTP. Your current verified status is unchanged.",
    id: "Dukcapil tidak dapat memverifikasi data e-KTP baru kamu. Status terverifikasi kamu saat ini tidak berubah.",
  },
  rekyc_fr_failed: {
    en: "We could not confirm it was you. Your identity data was not changed.",
    id: "Kami tidak bisa memastikan itu kamu. Data identitas kamu tidak diubah.",
  },
  superseded_by_newer_approval: {
    en: "Superseded by a newer approved submission.",
    id: "Digantikan oleh pengajuan baru yang disetujui.",
  },
  agent_rejected: {
    en: "Rejected by a KYC review agent.",
    id: "Ditolak oleh agen peninjau KYC.",
  },
};

export const REJECTION_IS_SYSTEM_SET: Record<RejectionReason, boolean> = {
  rekyc_id_mismatch: true,
  rekyc_dukcapil_not_verified: true,
  rekyc_fr_failed: true,
  superseded_by_newer_approval: true,
  agent_rejected: false,
};
