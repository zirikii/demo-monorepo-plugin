let counter = 0;

/** Deterministic-ish ids: readable in the portal and stable enough for snapshot-free tests. */
export function makeId(prefix: string): string {
  counter += 1;
  const stamp = Date.now().toString(36).slice(-5);
  return `${prefix}_${stamp}${counter.toString(36).padStart(2, "0")}`;
}

export function resetIdCounter(): void {
  counter = 0;
}
