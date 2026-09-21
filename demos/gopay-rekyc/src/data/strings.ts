import type { Bilingual } from "@/domain/pipeline";
import type { Locale } from "@/domain/types";

export function pick(value: Bilingual, locale: Locale): string {
  return locale === "id" ? value.id : value.en;
}

export const S = {
  appName: { id: "GoPay", en: "GoPay" },
  vacTitle: { id: "Pusat Akun Terverifikasi", en: "Verified Account Center" },
  vacSubtitle: {
    id: "Kelola status verifikasi dan data identitas kamu.",
    en: "Manage your verification status and identity data.",
  },
  identityCardTitle: { id: "Identitas terverifikasi", en: "Identitas terverifikasi" },
  identityCardBadge: { id: "Terverifikasi", en: "Verified" },
  seeMoreData: { id: "Lihat data lain", en: "See more data" },
  seeLessData: { id: "Sembunyikan data", en: "See less data" },
  updateRow: { id: "Perbarui data e-KTP", en: "Update e-KTP data" },
  updateRowHint: {
    id: "Nama, alamat, atau status perkawinan berubah?",
    en: "Name, address or marital status changed?",
  },
  walletLevel: { id: "Level akun", en: "Account level" },
  gopayPlus: { id: "GoPay Plus", en: "GoPay Plus" },
  gopayBasic: { id: "GoPay Basic", en: "GoPay Basic" },

  reviewTitle: { id: "Cek data e-KTP kamu", en: "Review your e-KTP data" },
  reviewExplainer: {
    id: "Ini data e-KTP yang tersimpan di akun kamu saat ini. Lanjutkan hanya kalau ada data yang sudah tidak sesuai dengan e-KTP fisik kamu.",
    en: "This is the e-KTP data currently on file for your account. Only continue if any of it no longer matches your physical e-KTP.",
  },
  reviewCta: { id: "Data e-KTP saya perlu diperbarui", en: "I need to update my e-KTP data" },
  notMineCta: { id: "e-KTP ini bukan milik saya", en: "This e-KTP is not mine" },
  maskedNote: {
    id: "Sebagian data sengaja disamarkan demi keamanan.",
    en: "Some fields are deliberately masked for your security.",
  },

  frTitle: { id: "Pastikan ini kamu", en: "Confirm it's really you" },
  frBody: {
    id: "Ambil selfie sekali lagi supaya kami yakin kamu yang mengubah data. Selfie ini juga dipakai ulang untuk verifikasi e-KTP, jadi kamu tidak perlu selfie dua kali.",
    en: "Take one live selfie so we know it's you changing the data. The same selfie is reused for e-KTP verification, so you never selfie twice.",
  },
  frCta: { id: "Mulai verifikasi wajah", en: "Start face verification" },
  frScanning: { id: "Mencocokkan wajah…", en: "Matching your face…" },
  frFailedTitle: { id: "Verifikasi wajah gagal", en: "Face verification failed" },
  frFailedBody: {
    id: "Kami tidak bisa memastikan itu kamu, jadi proses perbaruan data dihentikan. Data e-KTP kamu tidak berubah.",
    en: "We could not confirm it was you, so the update stopped here. Your e-KTP data is unchanged.",
  },

  captureKtpTitle: { id: "Foto e-KTP", en: "Photograph your e-KTP" },
  captureKtpHint: {
    id: "Letakkan e-KTP di dalam bingkai, pastikan seluruh kartu terlihat.",
    en: "Place the e-KTP inside the frame with the whole card visible.",
  },
  captureKtpCta: { id: "Ambil foto", en: "Take photo" },
  captureSelfieTitle: { id: "Selfie", en: "Selfie" },
  captureSelfieSkipped: {
    id: "Selfie dilewati — foto dari verifikasi wajah dipakai ulang.",
    en: "Selfie skipped — the photo from face verification is reused.",
  },

  processingTitle: { id: "Sedang memproses", en: "Processing" },
  processingBody: {
    id: "Jangan tutup halaman ini. Proses biasanya selesai dalam beberapa detik.",
    en: "Don't close this page. This usually takes a few seconds.",
  },

  eddTitle: { id: "Beberapa pertanyaan tambahan", en: "A few extra questions" },
  eddBody: {
    id: "Karena profil risiko kamu, kami perlu informasi tambahan sebelum pembaruan data disetujui.",
    en: "Because of your risk profile we need extra information before the update can be approved.",
  },
  eddCta: { id: "Kirim jawaban", en: "Submit answers" },

  pendingTitle: { id: "Data kamu sedang diperiksa", en: "Your data is being reviewed" },
  pendingBody: {
    id: "Foto e-KTP kamu perlu diperiksa manual oleh tim kami. Kami kabari lewat notifikasi dalam 1×24 jam. Status akun kamu tetap seperti sekarang.",
    en: "Your e-KTP photo needs a manual check by our team. We'll notify you within 24 hours. Your account status stays as it is.",
  },
  rejectedTitle: { id: "Pembaruan data gagal", en: "Update failed" },
  backToVac: { id: "Kembali ke Pusat Akun", en: "Back to Account Center" },
  tryAgain: { id: "Coba lagi", en: "Try again" },

  oddBannerTitle: { id: "Saatnya cek data identitas kamu", en: "Time to review your identity data" },
  oddBannerBody: {
    id: "Sesuai ketentuan Bank Indonesia, data identitas perlu ditinjau berkala. Cek sekarang supaya akunmu tetap lancar.",
    en: "Bank Indonesia rules require periodic identity reviews. Check now so your account keeps running.",
  },
  oddBannerCta: { id: "Cek data sekarang", en: "Review my data" },
  oddConfirmTitle: { id: "Apakah data e-KTP kamu masih sama?", en: "Is your e-KTP data still the same?" },
  oddConfirmSame: { id: "Ya, data masih sama", en: "Yes, still the same" },
  oddConfirmChanged: { id: "Ada data yang berubah", en: "Something has changed" },
  oddConfirmedToast: {
    id: "Terima kasih, data kamu sudah dikonfirmasi",
    en: "Thanks — your data has been confirmed",
  },

  blockedTitle: { id: "Lengkapi data dulu, ya", en: "Complete your data first" },
  blockedBody: {
    id: "Peninjauan data identitas kamu sudah lewat tenggat. Lengkapi pembaruan data untuk memakai aplikasi lagi. Saldo GoPay kamu tetap bisa dipakai di aplikasi lain.",
    en: "Your identity review is past due. Complete the update to use the app again. Your GoPay balance still works in other apps.",
  },
  blockedCta: { id: "Perbarui data sekarang", en: "Update my data now" },

  diraTitle: { id: "Dira", en: "Dira" },
  diraSubtitle: { id: "Asisten GoPay", en: "GoPay assistant" },
  inAppBrowserClose: { id: "Tutup", en: "Close" },
  genieDismiss: { id: "Tutup", en: "Dismiss" },
} satisfies Record<string, Bilingual>;

export type StringKey = keyof typeof S;
