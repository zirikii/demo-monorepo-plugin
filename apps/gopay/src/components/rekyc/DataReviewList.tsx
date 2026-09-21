import type { IdentityRecord } from "@/types/identity";
import { maskAddress, maskDob, maskName, maskNik, maskPlace, maskRtRw } from "@/lib/mask";

const collapsed = [
  { key: "fullName", label: "Nama", render: (i: IdentityRecord) => maskName(i.fullName) },
  { key: "nik", label: "NIK", render: (i: IdentityRecord) => maskNik(i.nik) },
  { key: "dateOfBirth", label: "Tanggal lahir", render: (i: IdentityRecord) => maskDob(i.dateOfBirth) },
  { key: "occupation", label: "Pekerjaan", render: (i: IdentityRecord) => i.occupation },
  { key: "address", label: "Alamat", render: (i: IdentityRecord) => maskAddress(i.address) },
  { key: "maritalStatus", label: "Status kawin", render: (i: IdentityRecord) => i.maritalStatus },
] as const;

const extra = [
  { key: "rtrw", label: "RT/RW", render: (i: IdentityRecord) => maskRtRw(i.rt, i.rw) },
  { key: "kelurahan", label: "Kelurahan", render: (i: IdentityRecord) => maskPlace(i.kelurahan) },
  { key: "kecamatan", label: "Kecamatan", render: (i: IdentityRecord) => maskPlace(i.kecamatan) },
  { key: "religion", label: "Agama", render: (i: IdentityRecord) => i.religion },
  { key: "gender", label: "Jenis kelamin", render: (i: IdentityRecord) => i.gender },
] as const;

export function DataReviewList({
  identity,
  expanded,
}: {
  identity: IdentityRecord;
  expanded: boolean;
}) {
  const rows = expanded ? [...collapsed, ...extra] : collapsed;
  return (
    <dl className="divide-y divide-line-soft rounded-3xl border border-line bg-card">
      {rows.map((row) => (
        <div key={row.key} className="flex items-start justify-between gap-4 px-4 py-3 text-sm">
          <dt className="text-ink-faint">{row.label}</dt>
          <dd className="max-w-[60%] text-right font-medium text-ink">{row.render(identity)}</dd>
        </div>
      ))}
    </dl>
  );
}
