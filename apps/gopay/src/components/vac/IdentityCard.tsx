import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import type { IdentityRecord } from "@/types/identity";
import { maskAddress, maskName, maskNik } from "@/lib/mask";

export function IdentityCard({
  identity,
  expanded,
  onToggle,
}: {
  identity: IdentityRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <section className="rounded-3xl border border-line bg-card p-4 shadow-card">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-gopay" aria-hidden="true" />
        <h2 className="text-sm font-bold text-ink">Identitas terverifikasi</h2>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-faint">NIK</dt>
          <dd className="font-semibold text-ink">{maskNik(identity.nik)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-faint">Nama</dt>
          <dd className="text-right font-semibold text-ink">{maskName(identity.fullName)}</dd>
        </div>
        {expanded ? (
          <>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-faint">Alamat</dt>
              <dd className="text-right text-ink">{maskAddress(identity.address)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-faint">Pekerjaan</dt>
              <dd className="text-ink">{identity.occupation}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-faint">Status kawin</dt>
              <dd className="text-ink">{identity.maritalStatus}</dd>
            </div>
          </>
        ) : null}
      </dl>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="mt-3 flex w-full items-center justify-center gap-1 text-sm font-semibold text-gopay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gopay"
      >
        {expanded ? "Lihat lebih sedikit" : "Lihat data lainnya"}
        {expanded ? (
          <ChevronUp className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </section>
  );
}
