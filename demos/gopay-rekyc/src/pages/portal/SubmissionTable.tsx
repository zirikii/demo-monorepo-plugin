import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { Submission, SubmissionStatus } from "@/domain/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";

const STATUS_TONE: Record<SubmissionStatus, BadgeTone> = {
  approved: "success",
  rejected: "danger",
  pending_review: "warning",
};

export function SubmissionTable({
  submissions,
  selectedId,
  onSelect,
}: {
  submissions: Submission[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink-faint">
          <th className="px-3 py-2 font-bold">Submission</th>
          <th className="px-3 py-2 font-bold">Type</th>
          <th className="px-3 py-2 font-bold">Submitted</th>
          <th className="px-3 py-2 font-bold">Documents</th>
          <th className="px-3 py-2 font-bold">Risk</th>
          <th className="px-3 py-2 font-bold">Status</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr
            key={submission.id}
            onClick={() => onSelect(submission.id)}
            data-testid={`submission-row-${submission.id}`}
            className={cn(
              "cursor-pointer border-b border-line-soft transition-colors hover:bg-surface",
              selectedId === submission.id && "bg-gopay-tint/60",
            )}
          >
            <td className="px-3 py-2.5 font-mono text-xs">{submission.id}</td>
            <td className="px-3 py-2.5">
              <Badge tone={submission.type === "reverification" ? "info" : "neutral"}>
                {submission.type === "reverification" ? "reverification" : "initial KYC"}
              </Badge>
            </td>
            <td className="px-3 py-2.5 text-xs text-ink-soft">
              {formatDateTime(submission.submittedAt, "en")}
            </td>
            <td className="px-3 py-2.5 text-xs text-ink-soft">
              {submission.documents.ktpImageId}
              <span className="block text-[10px] text-ink-faint">
                {submission.documents.selfieSource === "fr_reuse"
                  ? "selfie reused from FR"
                  : "selfie captured"}
              </span>
            </td>
            <td className="px-3 py-2.5 text-xs">
              {submission.riskScore} · {submission.riskTier}
            </td>
            <td className="px-3 py-2.5">
              <Badge tone={STATUS_TONE[submission.status]}>{submission.status}</Badge>
              {submission.rejectionReason ? (
                <span className="mt-1 block font-mono text-[10px] text-ink-faint">
                  {submission.rejectionReason}
                </span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
