import type { IdentityData } from "@/domain/types";

/** The record currently on file — what the e-KTP review screen shows back to the user. */
export const ON_FILE_IDENTITY: IdentityData = {
  nik: "3174094509900007",
  fullName: "Rani Puspita Dewi",
  placeOfBirth: "Jakarta",
  dateOfBirth: "1990-09-05",
  address: "Jl. Kemang Selatan VIII No. 42",
  rtRw: "004/007",
  kelurahan: "Bangka",
  kecamatan: "Mampang Prapatan",
  city: "Jakarta Selatan",
  province: "DKI Jakarta",
  religion: "Islam",
  gender: "Perempuan",
  maritalStatus: "Belum Kawin",
  occupation: "Karyawan Swasta",
  nationality: "WNI",
};

/** What OCR reads from the newly captured e-KTP: same NIK, updated address, status and job. */
export const UPDATED_IDENTITY: IdentityData = {
  ...ON_FILE_IDENTITY,
  fullName: "Rani Puspita Dewi",
  address: "Jl. Cipete Raya No. 118",
  rtRw: "002/003",
  kelurahan: "Cipete Selatan",
  kecamatan: "Cilandak",
  maritalStatus: "Kawin",
  occupation: "Wiraswasta",
};

/** A different card entirely — used by the NIK-mismatch scenario. */
export const MISMATCHED_IDENTITY: IdentityData = {
  ...UPDATED_IDENTITY,
  nik: "3276015208930012",
  fullName: "Rani P. Dewi",
};
