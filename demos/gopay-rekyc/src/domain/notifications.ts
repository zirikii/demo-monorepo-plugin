import type { Bilingual } from "./pipeline";

export type NotificationChannel = "push" | "genie";

export interface ChannelAvailability {
  gopay: boolean;
  gojek: boolean;
  gma: boolean;
}

export interface SuccessNotification {
  channel: NotificationChannel;
  availability: ChannelAvailability;
  details: Bilingual;
  body: Bilingual;
  /** Every success notification deep-links to the Verified Account Center. */
  target: "verified_account_center";
  dismissible: boolean;
}

/** PRD 4.2.1 success notification matrix. */
export const SUCCESS_NOTIFICATIONS: SuccessNotification[] = [
  {
    channel: "push",
    availability: { gopay: true, gojek: true, gma: true },
    details: {
      id: 'Konfirmasi + penegasan "aktif lagi", cukup pendek untuk pratinjau layar kunci.',
      en: 'Confirmation plus "active again" reassurance, short enough for a lock-screen preview.',
    },
    body: {
      id: "Data KYC diperbarui — akunmu udah aktif lagi. Yuk transaksi seperti biasa.",
      en: "Data KYC diperbarui — akunmu udah aktif lagi. Yuk transaksi seperti biasa.",
    },
    target: "verified_account_center",
    dismissible: false,
  },
  {
    channel: "genie",
    availability: { gopay: true, gojek: false, gma: true },
    details: {
      id: "Banner penegasan singkat, bisa ditutup, tanpa baris keamanan.",
      en: "Short reassurance banner, dismissible, no security line needed at this length.",
    },
    body: {
      id: "Data KYC kamu sudah diperbarui ✅",
      en: "Data KYC kamu sudah diperbarui ✅",
    },
    target: "verified_account_center",
    dismissible: true,
  },
];

export const SUCCESS_TOAST: Bilingual = {
  id: "Data e-KTP kamu sudah diperbarui",
  en: "Your e-KTP data has been updated",
};
