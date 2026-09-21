import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FLOW_LANES, type FlowNode } from "@/data/flow";
import { cn } from "@/lib/cn";

const KIND_STYLES: Record<FlowNode["kind"], string> = {
  entry: "border-gopay/40 bg-gopay-tint",
  screen: "border-line bg-white",
  check: "border-state-warning/30 bg-state-warning-tint",
  outcome: "border-gojek/30 bg-gojek-tint",
};

export function FlowDiagram() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8">
      <h1 className="text-xl font-extrabold">Flow</h1>
      <p className="mt-1 max-w-3xl text-sm text-ink-soft">
        The PRD&rsquo;s flow diagram, reconstructed from the written requirements. Every box that maps to
        a screen in this demo links to it.
      </p>

      <div className="mt-6 flex flex-wrap items-stretch gap-3">
        {FLOW_LANES.map((lane, laneIndex) => (
          <div key={lane.id} className="flex flex-1 items-stretch gap-3">
            <div className="min-w-[230px] flex-1 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wide text-ink-faint">
                {lane.title}
              </h2>
              {lane.nodes.map((node) => {
                const content = (
                  <div
                    className={cn(
                      "h-full rounded-xl border px-3 py-2.5 transition-shadow",
                      KIND_STYLES[node.kind],
                      node.route && "hover:shadow-card",
                    )}
                  >
                    <p className="text-xs font-bold text-ink">{node.label}</p>
                    <p className="mt-1 text-[11px] leading-snug text-ink-soft">{node.detail}</p>
                  </div>
                );
                return node.route ? (
                  <Link key={node.id} to={node.route} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={node.id}>{content}</div>
                );
              })}
            </div>
            {laneIndex < FLOW_LANES.length - 1 ? (
              <ArrowRight size={18} className="mt-8 shrink-0 self-start text-ink-faint" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
