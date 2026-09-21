import type { Bilingual } from "./pipeline";

export type OnboardingContext = "initial_kyc" | "rekyc";

export interface OnboardingCopy {
  eyebrow: Bilingual;
  title: Bilingual;
  bodyItems: Bilingual[];
  primaryCta: Bilingual;
}

/**
 * The OneKYC capture onboarding screen is reused as-is; only this copy config changes between
 * first-time registration and a re-KYC refresh (PRD 4.2 "Config-driven onboarding copy").
 */
export const ONBOARDING_COPY: Record<OnboardingContext, OnboardingCopy> = {
  initial_kyc: {
    eyebrow: { id: "Verifikasi akun", en: "Account verification" },
    title: { id: "Daftarkan identitas kamu", en: "Register your identity" },
    bodyItems: [
      { id: "Siapkan e-KTP asli milikmu", en: "Have your original e-KTP ready" },
      { id: "Pastikan cahaya cukup terang", en: "Make sure the lighting is bright enough" },
      { id: "Foto akan dicek otomatis", en: "Your photo is checked automatically" },
    ],
    primaryCta: { id: "Mulai verifikasi", en: "Start verification" },
  },
  rekyc: {
    eyebrow: { id: "Perbarui data", en: "Data update" },
    title: { id: "Perbarui data e-KTP kamu", en: "Update your e-KTP data" },
    bodyItems: [
      {
        id: "Ini pembaruan data yang sudah ada, bukan pendaftaran baru",
        en: "This refreshes your existing record — it is not a new signup",
      },
      { id: "Gunakan e-KTP terbaru dengan NIK yang sama", en: "Use your latest e-KTP with the same NIK" },
      { id: "GoPay Plus kamu tetap aktif selama proses", en: "Your GoPay Plus stays active during the process" },
    ],
    primaryCta: { id: "Foto e-KTP terbaru", en: "Photograph my latest e-KTP" },
  },
};
