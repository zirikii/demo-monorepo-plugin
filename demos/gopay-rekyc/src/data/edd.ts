import type { Bilingual } from "@/domain/pipeline";

export interface EddQuestion {
  id: string;
  prompt: Bilingual;
  options: Bilingual[];
}

/** Collected only when fresh risk scoring returns high risk (PRD 4.2 AC5). */
export const EDD_QUESTIONS: EddQuestion[] = [
  {
    id: "income_source",
    prompt: { id: "Sumber penghasilan utama kamu", en: "Your main source of income" },
    options: [
      { id: "Gaji karyawan", en: "Salary" },
      { id: "Usaha sendiri", en: "Own business" },
      { id: "Investasi", en: "Investments" },
      { id: "Lainnya", en: "Other" },
    ],
  },
  {
    id: "monthly_income",
    prompt: { id: "Perkiraan penghasilan per bulan", en: "Estimated monthly income" },
    options: [
      { id: "< Rp5 juta", en: "< IDR 5 million" },
      { id: "Rp5 – 20 juta", en: "IDR 5 – 20 million" },
      { id: "Rp20 – 100 juta", en: "IDR 20 – 100 million" },
      { id: "> Rp100 juta", en: "> IDR 100 million" },
    ],
  },
  {
    id: "purpose",
    prompt: { id: "Tujuan utama pakai GoPay", en: "Main purpose of using GoPay" },
    options: [
      { id: "Belanja harian", en: "Everyday spending" },
      { id: "Transfer keluarga", en: "Family transfers" },
      { id: "Transaksi usaha", en: "Business transactions" },
      { id: "Lainnya", en: "Other" },
    ],
  },
  {
    id: "pep",
    prompt: {
      id: "Apakah kamu atau keluarga inti seorang pejabat publik (PEP)?",
      en: "Are you or an immediate family member a politically exposed person (PEP)?",
    },
    options: [
      { id: "Tidak", en: "No" },
      { id: "Ya", en: "Yes" },
    ],
  },
];
