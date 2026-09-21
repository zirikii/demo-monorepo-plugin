import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { callbackPayload, pullApprovedData, type PullApiResponse } from "@/domain/partners";
import { formatDateTime } from "@/lib/format";
import { useDemo } from "@/state/useDemo";

export function PartnerConsole() {
  const { state } = useDemo();
  const [response, setResponse] = useState<PullApiResponse | null>(null);

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 px-6 py-8">
      <div>
        <h1 className="text-xl font-extrabold">Partner integration</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Linked partners: {state.ledger.account.linkedPartners.join(", ")}
        </p>
      </div>

      <Card>
        <CardHeader
          title="Callbacks"
          description="Sent to every linked partner when a submission becomes approved, or when the approved one is revoked."
        />
        <CardBody className="space-y-2">
          {state.ledger.partnerEvents.length === 0 ? (
            <EmptyState
              title="No callbacks yet"
              description="Complete a re-KYC approval in the app to fire notifications."
            />
          ) : (
            [...state.ledger.partnerEvents].reverse().map((event) => (
              <div
                key={event.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-line px-3 py-2"
              >
                <Badge tone="info">{event.partner}</Badge>
                <span className="font-mono text-xs text-ink">{event.event}</span>
                <span className="text-xs text-ink-soft">
                  {formatDateTime(event.occurredAt, "en")}
                </span>
                <code className="ml-auto rounded bg-surface px-2 py-1 text-[11px] text-ink-soft">
                  {JSON.stringify(callbackPayload(event))}
                </code>
              </div>
            ))
          )}
          <p className="text-[11px] text-ink-faint">
            The payload carries only the account identifier, what happened, and the timestamp — no
            identity data crosses the boundary.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Pull API"
          description="GET /v1/kyc/accounts/{account_id}/identity — returns the approved submission's data."
          action={
            <Button size="sm" onClick={() => setResponse(pullApprovedData(state.ledger))}>
              Call endpoint
            </Button>
          }
        />
        <CardBody>
          {response ? (
            <pre className="overflow-x-auto rounded-xl bg-ink px-4 py-3 text-[11px] leading-relaxed text-white">
              {JSON.stringify(response, null, 2)}
            </pre>
          ) : (
            <EmptyState
              title="No call made yet"
              description="Call the endpoint to see what a partner would receive right now."
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
