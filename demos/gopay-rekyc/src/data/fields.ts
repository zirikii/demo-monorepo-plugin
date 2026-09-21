import type { Bilingual } from "@/domain/pipeline";
import type { IdentityField } from "@/domain/types";

export const FIELD_LABELS: Record<IdentityField, Bilingual> = {
  nik: { id: "NIK", en: "NIK" },
  fullName: { id: "Nama lengkap", en: "Full name" },
  placeOfBirth: { id: "Tempat lahir", en: "Place of birth" },
  dateOfBirth: { id: "Tanggal lahir", en: "Date of birth" },
  address: { id: "Alamat", en: "Address" },
  rtRw: { id: "RT/RW", en: "RT/RW" },
  kelurahan: { id: "Kelurahan", en: "Kelurahan" },
  kecamatan: { id: "Kecamatan", en: "Kecamatan" },
  city: { id: "Kota", en: "City" },
  province: { id: "Provinsi", en: "Province" },
  religion: { id: "Agama", en: "Religion" },
  gender: { id: "Jenis kelamin", en: "Gender" },
  maritalStatus: { id: "Status perkawinan", en: "Marital status" },
  occupation: { id: "Pekerjaan", en: "Occupation" },
  nationality: { id: "Kewarganegaraan", en: "Nationality" },
};

/** e-KTP review screen opens collapsed on these six fields (PRD 4.2 AC2). */
export const REVIEW_COLLAPSED_FIELDS: IdentityField[] = [
  "fullName",
  "nik",
  "dateOfBirth",
  "occupation",
  "address",
  "maritalStatus",
];

/** "See more data" reveals these five (PRD 4.2 AC3). */
export const REVIEW_EXPANDED_FIELDS: IdentityField[] = [
  "rtRw",
  "kelurahan",
  "kecamatan",
  "religion",
  "gender",
];

/** The Verified Account Center card shows NIK and full name by default (PRD 4.1). */
export const VAC_DEFAULT_FIELDS: IdentityField[] = ["nik", "fullName"];

export const VAC_MORE_FIELDS: IdentityField[] = ["address", "occupation", "maritalStatus"];
