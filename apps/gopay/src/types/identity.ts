export type MaritalStatus = "Belum kawin" | "Kawin" | "Cerai hidup" | "Cerai mati";
export type Gender = "Laki-laki" | "Perempuan";
export type Religion =
  | "Islam"
  | "Kristen"
  | "Katolik"
  | "Hindu"
  | "Buddha"
  | "Konghucu";

export type IdentityRecord = {
  nik: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  occupation: string;
  maritalStatus: MaritalStatus;
  religion: Religion;
  gender: Gender;
};

export type IdentityFieldKey = keyof IdentityRecord;
