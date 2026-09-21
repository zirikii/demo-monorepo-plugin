export const eddQuestions = [
  {
    id: "source_of_funds",
    label: "Sumber dana utama di GoPay?",
    options: ["Gaji", "Usaha sendiri", "Orang tua / keluarga", "Investasi"],
  },
  {
    id: "monthly_in",
    label: "Perkiraan uang masuk per bulan",
    options: ["< Rp5 juta", "Rp5–20 juta", "Rp20–50 juta", "> Rp50 juta"],
  },
  {
    id: "occupation_confirm",
    label: "Pekerjaan saat ini masih sama?",
    options: ["Ya, masih sama", "Sudah ganti", "Tidak bekerja"],
  },
  {
    id: "pep",
    label: "Apakah kamu atau keluarga dekat pejabat publik (PEP)?",
    options: ["Tidak", "Ya"],
  },
] as const;

export const diraIntents = {
  rekyc: [
    "update ktp",
    "perbarui ktp",
    "ganti nama",
    "data kyc",
    "rekyc",
    "e-ktp",
    "ektp",
    "nik salah",
    "alamat berubah",
    "status kawin",
  ],
};
