import type { Bilingual } from "@/domain/pipeline";

export interface DiraQuickReply {
  id: string;
  label: Bilingual;
  /** Only the KTP-data intent hands the user to the re-KYC flow instead of raising a CCU ticket. */
  intent: "rekyc" | "ticket";
}

export interface DiraTurn {
  id: string;
  author: "dira" | "user";
  text: Bilingual;
}

export const DIRA_GREETING: DiraTurn[] = [
  {
    id: "greet",
    author: "dira",
    text: {
      id: "Hai Rani! Aku Dira, asisten GoPay. Ada yang bisa aku bantu?",
      en: "Hi Rani! I'm Dira, the GoPay assistant. How can I help?",
    },
  },
];

export const DIRA_QUICK_REPLIES: DiraQuickReply[] = [
  {
    id: "update-ktp",
    label: { id: "Ubah data KTP saya", en: "Update my KTP data" },
    intent: "rekyc",
  },
  {
    id: "wrong-address",
    label: { id: "Alamat di akun sudah pindah", en: "My address on file has changed" },
    intent: "rekyc",
  },
  {
    id: "topup-failed",
    label: { id: "Top up gagal", en: "Top up failed" },
    intent: "ticket",
  },
];

export const DIRA_REKYC_RESPONSE: Bilingual = {
  id: "Kamu bisa memperbarui data e-KTP sendiri tanpa perlu dibantu agen. Aku bantu arahkan ke prosesnya, ya.",
  en: "You can update your e-KTP data yourself without an agent. Let me take you to the flow.",
};

export const DIRA_TICKET_RESPONSE: Bilingual = {
  id: "Aku buatkan tiket ke tim kami, ya. Nomor tiketmu akan dikirim lewat notifikasi.",
  en: "I'll raise a ticket with our team. Your ticket number will arrive by notification.",
};

export const DIRA_ENTRY_CARD: { title: Bilingual; body: Bilingual; cta: Bilingual } = {
  title: { id: "Perbarui data e-KTP", en: "Update e-KTP data" },
  body: {
    id: "Proses mandiri, sekitar 3 menit. GoPay Plus kamu tetap aktif.",
    en: "Self-serve, about 3 minutes. Your GoPay Plus stays active.",
  },
  cta: { id: "Mulai sekarang", en: "Start now" },
};
