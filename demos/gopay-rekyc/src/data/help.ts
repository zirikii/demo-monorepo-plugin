import type { Bilingual } from "@/domain/pipeline";

export interface HelpArticle {
  slug: string;
  url: string;
  title: Bilingual;
  updatedAt: string;
  paragraphs: Bilingual[];
  steps: Bilingual[];
}

/**
 * Opened in the in-app browser when the user says the e-KTP on screen is not theirs. No re-KYC
 * session is started and no FR, capture or Dukcapil call is triggered.
 */
export const NOT_MY_EKTP_ARTICLE: HelpArticle = {
  slug: "ektp-bukan-milik-saya",
  url: "https://www.gopay.co.id/help/ektp-bukan-milik-saya",
  title: { id: "e-KTP ini bukan milik saya", en: "This e-KTP is not mine" },
  updatedAt: "2026-09-12T00:00:00.000Z",
  paragraphs: [
    {
      id: "Kalau data e-KTP yang tampil bukan milik kamu, jangan lanjutkan proses pembaruan data. Memverifikasi identitas orang lain bisa membuat akunmu dibekukan.",
      en: "If the e-KTP shown is not yours, do not continue the update. Verifying someone else's identity can get your account frozen.",
    },
    {
      id: "Tim KYC kami akan memeriksa akun kamu dan menghubungi kamu lewat email terdaftar dalam 2 hari kerja.",
      en: "Our KYC team will review your account and contact you at your registered email within 2 business days.",
    },
  ],
  steps: [
    {
      id: "Tutup halaman ini dan jangan lanjutkan foto e-KTP.",
      en: "Close this page and do not continue to e-KTP capture.",
    },
    {
      id: "Laporkan lewat Dira dengan memilih topik “Data identitas bukan milik saya”.",
      en: 'Report it through Dira using the "identity data is not mine" topic.',
    },
    {
      id: "Siapkan e-KTP asli milikmu untuk proses verifikasi ulang oleh agen.",
      en: "Have your own original e-KTP ready for the agent-led re-verification.",
    },
  ],
};
