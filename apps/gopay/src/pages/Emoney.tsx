import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { DemoRibbon } from "@/components/ui/DemoRibbon";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRekyc } from "@/hooks/useRekyc";
import { assertNever, formatDateId } from "@/lib/format";
import { overrideSubmissionStatus } from "@/lib/rekyc-engine";
import type { Submission, SubmissionStatus, SubmissionType } from "@/types/submission";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const helper = createColumnHelper<Submission>();

function statusTone(status: SubmissionStatus) {
  switch (status) {
    case "approved":
      return "positive" as const;
    case "rejected":
      return "critical" as const;
    case "pending":
      return "caution" as const;
    default: {
      const _exhaustive: never = status;
      return assertNever(_exhaustive);
    }
  }
}

export function EmoneyPage() {
  useDocumentTitle("EMoney Portal — GoPay (Demo)");
  const { store, setStore } = useRekyc();
  const [typeFilter, setTypeFilter] = useState<"all" | SubmissionType>("all");
  const rows = useMemo(() => {
    const list = [...store.submissions].sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
    );
    return typeFilter === "all" ? list : list.filter((s) => s.type === typeFilter);
  }, [store.submissions, typeFilter]);

  const columns = useMemo(
    () => [
      helper.accessor("id", { header: "ID" }),
      helper.accessor("accountId", { header: "Account" }),
      helper.accessor("type", {
        header: "Type",
        cell: (ctx) => (ctx.getValue() === "reverification" ? "Reverification" : "Initial KYC"),
      }),
      helper.accessor("submittedAt", {
        header: "Submitted",
        cell: (ctx) => formatDateId(ctx.getValue()),
      }),
      helper.accessor("status", {
        header: "Status",
        cell: (ctx) => <Badge tone={statusTone(ctx.getValue())}>{ctx.getValue()}</Badge>,
      }),
      helper.accessor("reason", { header: "Reason" }),
      helper.accessor("level1", { header: "Level 1" }),
      helper.accessor("level2", { header: "Level 2" }),
      helper.accessor("systemDetails", { header: "System" }),
    ],
    [],
  );

  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-line bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <img src="/brand/logo-green.svg" alt="GoPay" className="h-7" />
          <h1 className="text-lg font-extrabold">EMoney · KYC submissions</h1>
        </div>
        <div className="flex items-center gap-3">
          <DemoRibbon label="Unofficial demo" className="border-line text-ink-faint" />
          <Link to="/" className="text-sm font-semibold text-gopay">
            Consumer app
          </Link>
        </div>
      </header>
      <div className="px-6 py-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {(["all", "initial_kyc", "reverification"] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={typeFilter === t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                typeFilter === t ? "bg-gopay text-white" : "bg-white text-ink border border-line"
              }`}
            >
              {t === "all" ? "All" : t === "initial_kyc" ? "Initial KYC" : "Reverification"}
            </button>
          ))}
          <Link to="/emoney/callbacks" className="ml-auto text-sm font-semibold text-pay">
            Partner callbacks
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-line-soft text-xs uppercase text-ink-soft">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-3 py-2 font-semibold">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                  <th className="px-3 py-2">Docs</th>
                  <th className="px-3 py-2">Agent</th>
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t border-line-soft">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="max-w-[220px] truncate px-3 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-3 py-2 text-xs text-ink-soft">KTP · Selfie</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          setStore({
                            ...store,
                            submissions: overrideSubmissionStatus(
                              store.submissions,
                              row.original.id,
                              "approved",
                            ),
                          })
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setStore({
                            ...store,
                            submissions: overrideSubmissionStatus(
                              store.submissions,
                              row.original.id,
                              "rejected",
                              "agent_override",
                            ),
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
