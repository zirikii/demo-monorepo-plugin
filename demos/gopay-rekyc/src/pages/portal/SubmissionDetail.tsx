import { FileImage } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { FIELD_LABELS } from "@/data/fields";
import { pick } from "@/data/strings";
import { REJECTION_COPY, REJECTION_IS_SYSTEM_SET } from "@/domain/rejection";
import type { IdentityField, Submission } from "@/domain/types";
import { formatDateTime } from "@/lib/format";

const LEVEL_1_FIELDS: IdentityField[] = [
  "nik",
  "fullName",
  "placeOfBirth",
  "dateOfBirth",
  "gender",
  "nationality",
];

const LEVEL_2_FIELDS: IdentityField[] = [
  "address",
  "rtRw",
  "kelurahan",
  "kecamatan",
  "city",
  "province",
  "religion",
  "maritalStatus",
  "occupation",
];

export function SubmissionDetail({
  submission,
  onOverride,
}: {
  submission: Submission;
  onOverride: (status: Submission["status"]) => void;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title={`${submission.id} · ${submission.type}`}
          description={`Submitted ${formatDateTime(submission.submittedAt, "en")}${
            submission.decidedAt ? ` · decided ${formatDateTime(submission.decidedAt, "en")}` : ""
          }`}
          action={<Badge tone="neutral">{submission.status}</Badge>}
        />
        <CardBody className="space-y-3">
          {submission.rejectionReason ? (
            <div className="rounded-xl bg-state-danger-tint px-3 py-2">
              <p className="font-mono text-xs font-bold text-state-danger">
                {submission.rejectionReason}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {pick(REJECTION_COPY[submission.rejectionReason], "en")}
              </p>
              <p className="mt-1 text-[10px] text-ink-faint">
                {REJECTION_IS_SYSTEM_SET[submission.rejectionReason]
                  ? "system-set reason"
                  : "agent-set reason"}
              </p>
            </div>
          ) : null}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onOverride("approved")}>
              Approve
            </Button>
            <Button size="sm" variant="danger" onClick={() => onOverride("rejected")}>
              Reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onOverride("pending_review")}>
              Send back to queue
            </Button>
          </div>
          <p className="text-[11px] text-ink-faint">
            Overriding changes this submission&rsquo;s status only — no new submission is created, and the
            submitted data stays exactly as captured.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Submitted documents" />
        <CardBody className="flex gap-3">
          {[submission.documents.ktpImageId, submission.documents.selfieImageId].map((imageId) => (
            <div
              key={imageId}
              className="flex h-24 w-36 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-surface text-[10px] text-ink-faint"
            >
              <FileImage size={20} />
              <span className="px-2 text-center font-mono">{imageId}</span>
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Level 1 details" />
          <CardBody>
            <FieldTable submission={submission} fields={LEVEL_1_FIELDS} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Level 2 details" />
          <CardBody>
            <FieldTable submission={submission} fields={LEVEL_2_FIELDS} />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="System details" description="Produced during this verification only." />
        <CardBody>
          <dl className="grid gap-x-6 gap-y-1 text-xs sm:grid-cols-2">
            {Object.entries(submission.system).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3 border-b border-line-soft py-1">
                <dt className="text-ink-soft">{key}</dt>
                <dd className="font-mono text-ink">{String(value)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-b border-line-soft py-1">
              <dt className="text-ink-soft">riskScore</dt>
              <dd className="font-mono text-ink">{submission.riskScore}</dd>
            </div>
            <div className="flex justify-between gap-3 border-b border-line-soft py-1">
              <dt className="text-ink-soft">riskTier</dt>
              <dd className="font-mono text-ink">{submission.riskTier}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}

function FieldTable({ submission, fields }: { submission: Submission; fields: IdentityField[] }) {
  return (
    <dl className="space-y-1 text-xs">
      {fields.map((field) => (
        <div key={field} className="flex justify-between gap-3 border-b border-line-soft py-1">
          <dt className="text-ink-soft">{pick(FIELD_LABELS[field], "en")}</dt>
          <dd className="text-right font-semibold text-ink">{submission.data[field]}</dd>
        </div>
      ))}
    </dl>
  );
}
