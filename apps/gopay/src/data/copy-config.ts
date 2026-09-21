import type { CaptureCopyContext } from "@/types/rekyc";

export const captureCopy: Record<
  CaptureCopyContext,
  { eyebrow: string; title: string; body: string[]; cta: string }
> = {
  kyc: {
    eyebrow: "Upgrade GoPay Plus",
    title: "Daftar dengan e-KTP kamu",
    body: [
      "Foto e-KTP asli, bukan fotokopi.",
      "Pastikan seluruh kartu masuk bingkai.",
      "Selfie diambil setelah foto KTP.",
    ],
    cta: "Mulai verifikasi",
  },
  rekyc: {
    eyebrow: "Perbarui data",
    title: "Kamu lagi memperbarui data e-KTP, bukan daftar baru",
    body: [
      "Pakai e-KTP fisik yang terbaru.",
      "NIK harus sama dengan yang terdaftar di akun ini.",
      "Selfie dari verifikasi wajah barusan dipakai ulang — tidak perlu foto dua kali.",
    ],
    cta: "Mulai foto e-KTP",
  },
};

export const reviewCopy = {
  title: "Data e-KTP di akunmu",
  explainer:
    "Ini data e-KTP yang kami simpan saat ini. Lanjut hanya kalau ada yang tidak cocok dengan e-KTP fisik kamu.",
  seeMore: "See more data",
  seeLess: "See less data",
  primaryCta: "I need to update my e-KTP data",
  primaryCtaId: "Saya perlu perbarui data e-KTP",
  notMine: "This e-KTP is not mine",
  notMineId: "e-KTP ini bukan milik saya",
};

export const helpNotMine = {
  slug: "ektp-bukan-milik-saya",
  title: "This e-KTP is not mine",
  body: [
    "Kalau data e-KTP di Pusat Akun Terverifikasi bukan milikmu, jangan lanjut ReKYC.",
    "Hubungi Dira atau tim keamanan GoPay. Kami tidak akan memulai sesi FR, foto KTP, atau panggilan Dukcapil dari langkah ini.",
    "Artikel bantuan lengkap menyusul (Aditya Nursyamsi, 24 Sept).",
  ],
};
