export function assertNever(value: never, message = "Unhandled union member"): never {
  throw new Error(`${message}: ${String(value)}`);
}

export function formatIdr(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateId(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatDateOnly(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(iso));
}
