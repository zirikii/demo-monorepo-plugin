import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { COVERAGE, type CoverageStatus } from "@/data/traceability";

const STATUS_TONE: Record<CoverageStatus, BadgeTone> = {
  implemented: "success",
  simulated: "info",
  interpreted: "warning",
  backend_only: "neutral",
};

type Filter = CoverageStatus | "all";

export function Traceability() {
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(
    () => (filter === "all" ? COVERAGE : COVERAGE.filter((item) => item.status === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const base: Record<CoverageStatus, number> = {
      implemented: 0,
      simulated: 0,
      interpreted: 0,
      backend_only: 0,
    };
    for (const item of COVERAGE) base[item.status] += 1;
    return base;
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] space-y-4 px-6 py-8">
      <div>
        <h1 className="text-xl font-extrabold">PRD coverage</h1>
        <p className="mt-1 max-w-3xl text-sm text-ink-soft">
          Every acceptance criterion in the PRD, where it lives in this codebase, and which ones
          needed a judgement call. {COVERAGE.length} criteria · {counts.implemented} implemented ·{" "}
          {counts.simulated} simulated · {counts.interpreted} interpreted · {counts.backend_only}{" "}
          modelled without a backend.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Criteria"
          action={
            <SegmentedControl<Filter>
              ariaLabel="Filter coverage by status"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All" },
                { value: "implemented", label: "Implemented" },
                { value: "simulated", label: "Simulated" },
                { value: "interpreted", label: "Interpreted" },
                { value: "backend_only", label: "No backend" },
              ]}
            />
          }
        />
        <CardBody className="space-y-2">
          {rows.map((item, index) => (
            <div
              key={`${item.section}-${index}`}
              className="rounded-xl border border-line px-4 py-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="neutral">{item.section}</Badge>
                <span className="text-sm font-bold">{item.requirement}</span>
                <Badge tone={STATUS_TONE[item.status]} className="ml-auto">
                  {item.status.replace("_", " ")}
                </Badge>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{item.criterion}</p>
              <p className="mt-1.5 font-mono text-[11px] text-ink-faint">{item.where}</p>
              {item.note ? (
                <p className="mt-1.5 rounded-lg bg-state-warning-tint px-2.5 py-1.5 text-[11px] text-ink-soft">
                  {item.note}
                </p>
              ) : null}
              {item.route ? (
                <Link
                  to={item.route}
                  className="mt-1.5 inline-block text-[11px] font-bold text-gopay-deep underline"
                >
                  Open {item.route}
                </Link>
              ) : null}
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
