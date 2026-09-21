import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { PipelineTrace } from "@/components/rekyc/PipelineTrace";
import { approvedSubmission, reportedTier } from "@/domain/ledger";
import { daysUntilDue } from "@/domain/odd";
import { formatDate, formatDateTime } from "@/lib/format";
import { useDemo } from "@/state/useDemo";

const CHANNEL_TONE = {
  session: "info",
  ledger: "success",
  partner: "warning",
  system: "neutral",
} as const;

/** Side panel that shows what the flow did to the ledger — the demo's "show your working". */
export function SessionInspector() {
  const { state } = useDemo();
  const { account } = state.ledger;
  const approved = approvedSubmission(state.ledger);
  const tier = reportedTier(state.ledger);

  return (
    <div className="w-[420px] min-w-[320px] flex-1 space-y-4">
      <Card>
        <CardHeader
          title="Account state"
          description="Everything here is derived from the submission ledger, never stored separately."
        />
        <CardBody className="space-y-2 text-sm">
          <Row label="KYC status">
            <Badge tone={account.kycStatus === "approved" ? "success" : "danger"}>
              {account.kycStatus}
            </Badge>
          </Row>
          <Row label="Wallet level">
            <span className="font-semibold">{account.walletLevel}</span>
          </Row>
          <Row label="Reported risk tier">
            {tier ? <Badge tone="info">{tier}</Badge> : <span className="text-ink-faint">none</span>}
          </Row>
          <Row label="Data in use">
            <span className="font-mono text-xs">{approved ? approved.id : "—"}</span>
          </Row>
          <Row label="ODD due">
            <span className="text-xs">
              {formatDate(account.oddDueAt, "en")} ({daysUntilDue(state.now, account.oddDueAt)}d)
            </span>
          </Row>
          <Row label="Submissions">
            <Link className="text-xs font-bold text-gopay-deep underline" to="/portal">
              {state.ledger.submissions.length} in portal
            </Link>
          </Row>
        </CardBody>
      </Card>

      {state.session ? (
        <Card>
          <CardHeader
            title="re-KYC session"
            description={`${state.session.id} · entry point: ${state.session.entryPoint}`}
          />
          <CardBody className="space-y-2 text-sm">
            <Row label="FR gate">
              {state.session.frPassed === null ? (
                <span className="text-ink-faint">not run</span>
              ) : (
                <Badge tone={state.session.frPassed ? "success" : "danger"}>
                  {state.session.frPassed ? "passed" : "failed"}
                </Badge>
              )}
            </Row>
            <Row label="Selfie source">
              <span className="text-xs">{state.session.selfieSource ?? "—"}</span>
            </Row>
            <Row label="EDD">
              <span className="text-xs">{state.session.eddCompleted ? "completed" : "—"}</span>
            </Row>
            {state.session.result ? (
              <div className="pt-2">
                <PipelineTrace steps={state.session.result.steps} locale="en" />
              </div>
            ) : null}
          </CardBody>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Effect log" description="Ledger, partner and session effects in order." />
        <CardBody className="max-h-80 space-y-2 overflow-y-auto">
          {state.activity.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2 text-xs">
              <Badge tone={CHANNEL_TONE[entry.channel]}>{entry.channel}</Badge>
              <span className="min-w-0 flex-1 text-ink-soft">{entry.message}</span>
              <span className="shrink-0 text-[10px] text-ink-faint">
                {formatDateTime(entry.at, "en").split(", ")[1]}
              </span>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-ink-soft">{label}</span>
      {children}
    </div>
  );
}
