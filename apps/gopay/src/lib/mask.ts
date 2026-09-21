const BULLET = "•";

function maskKeepEdges(value: string, keepStart: number, keepEnd: number): string {
  if (value.length <= keepStart + keepEnd) {
    return BULLET.repeat(Math.max(value.length, 4));
  }
  const start = value.slice(0, keepStart);
  const end = keepEnd > 0 ? value.slice(-keepEnd) : "";
  const middle = BULLET.repeat(Math.max(4, value.length - keepStart - keepEnd));
  return `${start}${middle}${end}`;
}

/** NIK, address parts, RT/RW — masked. */
export function maskNik(nik: string): string {
  return maskKeepEdges(nik.replace(/\s/g, ""), 4, 2);
}

export function maskName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0] ?? "";
  if (parts.length === 1) return maskKeepEdges(first, 1, 0);
  return `${first} ${BULLET.repeat(6)}`;
}

export function maskDob(_isoOrDisplay: string): string {
  return `${BULLET}${BULLET}/${BULLET}${BULLET}/${BULLET.repeat(4)}`;
}

export function maskAddress(address: string): string {
  const first = address.trim().split(/\s+/)[0] ?? "";
  return `${first} ${BULLET.repeat(10)}`;
}

export function maskRtRw(_rt: string, _rw: string): string {
  return `${BULLET.repeat(3)}/${BULLET.repeat(3)}`;
}

export function maskPlace(value: string): string {
  return maskKeepEdges(value, 2, 0);
}

export type FieldMaskKind = "nik" | "name" | "dob" | "address" | "rtrw" | "place" | "full";

export function maskField(kind: FieldMaskKind, value: string, extra?: string): string {
  switch (kind) {
    case "nik":
      return maskNik(value);
    case "name":
      return maskName(value);
    case "dob":
      return maskDob(value);
    case "address":
      return maskAddress(value);
    case "rtrw":
      return maskRtRw(value, extra ?? "");
    case "place":
      return maskPlace(value);
    case "full":
      return value;
    default: {
      const _exhaustive: never = kind;
      return assertNeverMask(_exhaustive);
    }
  }
}

function assertNeverMask(value: never): never {
  throw new Error(`Unhandled mask kind: ${String(value)}`);
}
