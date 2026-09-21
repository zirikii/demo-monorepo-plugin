import { useMemo, useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { LedgerConstraintError } from "@/domain/ledger";
import type { SubmissionType } from "@/domain/types";
import { useDemo } from "@/state/useDemo";
import { SubmissionDetail } from "./SubmissionDetail";
import { SubmissionTable } from "./SubmissionTable";

type TypeFilter = SubmissionType | "all";

export function Portal() {
  const { state, dispatch } = useDemo();
  const [filter, setFilter] = useState<TypeFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const rows = useMemo(() => {
    const sorted = [...state.ledger.submissions].sort(
      (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
    );
    return filter === "all" ? sorted : sorted.filter((submission) => submission.type === filter);
  }, [state.ledger.submissions, filter]);

  const selected =
    state.ledger.submissions.find((submission) => submission.id === selectedId) ?? null;

  function override(status: "approved" | "rejected" | "pending_review") {
    if (!selected) return;
    try {
      dispatch({ type: "overrideDecision", submissionId: selected.id, status });
      setError(null);
    } catch (thrown) {
      setError(
        thrown instanceof LedgerConstraintError
          ? `${thrown.constraint}: ${thrown.message}`
          : String(thrown),
      );
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 px-6 py-8">
      <div>
        <h1 className="text-xl font-extrabold">E-Money Portal — KYC submissions</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Account {state.ledger.account.accountId} · {state.ledger.account.displayName} · KYC status{" "}
          <span className="font-semibold">{state.ledger.account.kycStatus}</span>
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-state-danger-tint px-4 py-3 text-sm font-semibold text-state-danger">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader
          title="Submissions"
          description="Reverification rows sit alongside initial KYC in chronological order."
          action={
            <SegmentedControl<TypeFilter>
              ariaLabel="Filter by submission type"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "initial_kyc", label: "Initial KYC" },
                { value: "reverification", label: "Reverification" },
              ]}
            />
          }
        />
        <CardBody className="overflow-x-auto px-2">
          <SubmissionTable submissions={rows} selectedId={selectedId} onSelect={setSelectedId} />
        </CardBody>
      </Card>

      {selected ? (
        <SubmissionDetail submission={selected} onOverride={override} />
      ) : (
        <EmptyState
          title="Select a submission"
          description="Open a row to see documents, Level 1 and Level 2 details, system details, and the agent override controls."
        />
      )}
    </div>
  );
}
