import { ArrowRight, Bot, ClipboardList, PlugZap, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const SURFACES = [
  {
    to: "/app/vac",
    icon: ShieldCheck,
    title: "Verified Account Center",
    body: "The self-initiated entry point: the Identitas terverifikasi card, masked data, and the update row.",
  },
  {
    to: "/app/dira",
    icon: Bot,
    title: "Dira",
    body: "A KTP-data request is answered with a re-KYC entry point instead of a CCU ticket.",
  },
  {
    to: "/portal",
    icon: ClipboardList,
    title: "E-Money Portal",
    body: "Reverification rows alongside initial KYC, filterable by type, with agent decision override.",
  },
  {
    to: "/partners",
    icon: PlugZap,
    title: "Partner callbacks",
    body: "Approval notifications carrying no identity data, plus the on-demand pull API.",
  },
  {
    to: "/scenario",
    icon: SlidersHorizontal,
    title: "Scenario console",
    body: "Drive FR, OCR, screening, risk, Dukcapil and ODD blocking to reach every branch.",
  },
];

const METRICS = [
  { label: "re-KYC approval rate (wallet level)", target: "≥ 80%" },
  { label: "Reduction of KYC ticket volume", target: "≥ X%" },
  { label: "Target launch", target: "September 2026" },
];

export function Overview() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-gopay-deep">
        PRD: Self-Serve re-KYC (Consumer)
      </p>
      <h1 className="mt-2 max-w-3xl text-3xl font-extrabold leading-tight">
        Update stale e-KTP data without losing GoPay Plus
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">
        Today a user with a changed name, address or marital status has to ask CCU to downgrade
        their GoPay Plus and redo KYC by hand — about half of the KYC team&rsquo;s workload, and the user
        loses 2FA and access to financial products in the process. This demo is a working replica of
        the self-serve flow that replaces it: one immutable submission per attempt, at most one
        approved at a time, and no downgrade when an attempt fails.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {METRICS.map((metric) => (
          <Badge key={metric.label} tone="neutral">
            {metric.label}: {metric.target}
          </Badge>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SURFACES.map((surface) => (
          <Link key={surface.to} to={surface.to}>
            <Card className="h-full transition-shadow hover:shadow-card">
              <CardBody>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gopay-tint text-gopay-deep">
                  <surface.icon size={19} />
                </span>
                <h2 className="mt-3 flex items-center gap-1.5 text-sm font-bold">
                  {surface.title}
                  <ArrowRight size={14} className="text-ink-faint" />
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{surface.body}</p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardBody className="space-y-2">
          <h2 className="text-sm font-bold">Start here</h2>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-soft">
            <li>
              Open the <Link className="font-semibold text-gopay-deep underline" to="/app/vac">Verified Account Center</Link>{" "}
              and expand the identity card.
            </li>
            <li>Tap “Perbarui data e-KTP”, review the masked e-KTP data, then start the update.</li>
            <li>Pass the face check, photograph the card, and watch the pipeline decide.</li>
            <li>
              Compare the outcome against the{" "}
              <Link className="font-semibold text-gopay-deep underline" to="/portal">
                submission ledger
              </Link>{" "}
              and{" "}
              <Link className="font-semibold text-gopay-deep underline" to="/partners">
                partner callbacks
              </Link>
              .
            </li>
            <li>
              Switch branches from the{" "}
              <Link className="font-semibold text-gopay-deep underline" to="/scenario">
                scenario console
              </Link>{" "}
              (NIK mismatch, low OCR, high risk EDD, Dukcapil re-run, ODD blocking).
            </li>
          </ol>
        </CardBody>
      </Card>
    </div>
  );
}
