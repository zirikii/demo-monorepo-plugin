import type { IdentityData, IdentityField } from "./types";

/**
 * PRD 4.2 "Masking details": NIK, full name, date of birth, address, RT/RW, kelurahan and
 * kecamatan are masked. Occupation, marital status, religion and gender are shown in full.
 */
export const MASKED_FIELDS: readonly IdentityField[] = [
  "nik",
  "fullName",
  "dateOfBirth",
  "address",
  "rtRw",
  "kelurahan",
  "kecamatan",
];

export const UNMASKED_FIELDS: readonly IdentityField[] = [
  "occupation",
  "maritalStatus",
  "religion",
  "gender",
];

export function isMaskedField(field: IdentityField): boolean {
  return MASKED_FIELDS.includes(field);
}

const DOT = "•";

export function maskNik(nik: string): string {
  const digits = nik.replace(/\s/g, "");
  if (digits.length <= 8) return DOT.repeat(digits.length);
  return `${digits.slice(0, 4)}${DOT.repeat(digits.length - 8)}${digits.slice(-4)}`;
}

/** Keeps the first letter of each word so the user can still recognise their own name. */
export function maskName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const head = word.slice(0, 1);
      return word.length > 1 ? `${head}${DOT.repeat(Math.min(word.length - 1, 6))}` : head;
    })
    .join(" ");
}

/** Only the year survives: `17-08-1990` → `••-••-1990`. */
export function maskDateOfBirth(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return DOT.repeat(8);
  return `${DOT.repeat(2)}-${DOT.repeat(2)}-${date.getFullYear()}`;
}

export function maskAddress(address: string): string {
  const [street = "", ...rest] = address.split(",");
  const words = street.trim().split(/\s+/).filter(Boolean);
  const visible = words.slice(0, 1).join(" ");
  const maskedTail = words.slice(1).map((word) => DOT.repeat(Math.min(word.length, 6)));
  const maskedRest = rest.map(() => DOT.repeat(5));
  return [visible, ...maskedTail].join(" ") + (maskedRest.length ? `, ${maskedRest.join(", ")}` : "");
}

export function maskRtRw(value: string): string {
  return value.replace(/\d/g, DOT);
}

export function maskRegion(value: string): string {
  const head = value.slice(0, 2);
  return `${head}${DOT.repeat(Math.max(value.length - 2, 3))}`;
}

export function maskField(field: IdentityField, value: string): string {
  switch (field) {
    case "nik":
      return maskNik(value);
    case "fullName":
      return maskName(value);
    case "dateOfBirth":
      return maskDateOfBirth(value);
    case "address":
      return maskAddress(value);
    case "rtRw":
      return maskRtRw(value);
    case "kelurahan":
    case "kecamatan":
      return maskRegion(value);
    default:
      return value;
  }
}

export function maskIdentity(identity: IdentityData): IdentityData {
  const masked = { ...identity };
  for (const field of MASKED_FIELDS) {
    masked[field] = maskField(field, identity[field]);
  }
  return masked;
}
