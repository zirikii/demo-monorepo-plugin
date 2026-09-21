import { useState } from "react";
import { ArrowRight, Bot, FileCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import {
  DIRA_ENTRY_CARD,
  DIRA_GREETING,
  DIRA_QUICK_REPLIES,
  DIRA_REKYC_RESPONSE,
  DIRA_TICKET_RESPONSE,
  type DiraQuickReply,
  type DiraTurn,
} from "@/data/dira";
import { S } from "@/data/strings";
import { useDemo } from "@/state/useDemo";
import { cn } from "@/lib/cn";

/**
 * Dira replaces the old "update KYC data" help page: a KTP-data request is answered with an entry
 * point into the re-KYC flow instead of a CCU ticket (PRD 4.1).
 */
export function Dira() {
  const { t } = useDemo();
  const navigate = useNavigate();
  const [turns, setTurns] = useState<DiraTurn[]>(DIRA_GREETING);
  const [showEntryCard, setShowEntryCard] = useState(false);

  function ask(reply: DiraQuickReply) {
    const answer = reply.intent === "rekyc" ? DIRA_REKYC_RESPONSE : DIRA_TICKET_RESPONSE;
    setTurns((current) => [
      ...current,
      { id: `${reply.id}-user`, author: "user", text: reply.label },
      { id: `${reply.id}-dira`, author: "dira", text: answer },
    ]);
    setShowEntryCard(reply.intent === "rekyc");
  }

  function startFromDira() {
    navigate("/app/rekyc/review", { state: { entryPoint: "dira" } });
  }

  return (
    <>
      <PhoneAppBar title={t(S.diraTitle)} onBack={() => navigate("/app")} />
      <PhoneBody className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gopay text-white">
            <Bot size={16} />
          </span>
          <span className="text-xs text-ink-soft">{t(S.diraSubtitle)}</span>
        </div>

        {turns.map((turn) => (
          <div
            key={turn.id}
            className={cn("flex", turn.author === "user" ? "justify-end" : "justify-start")}
          >
            <p
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                turn.author === "user"
                  ? "rounded-br-sm bg-gopay text-white"
                  : "rounded-bl-sm bg-surface text-ink",
              )}
            >
              {t(turn.text)}
            </p>
          </div>
        ))}

        {showEntryCard ? (
          <button
            type="button"
            onClick={startFromDira}
            data-testid="dira-rekyc-entry"
            className="flex w-full items-center gap-3 rounded-2xl border border-gopay/40 bg-gopay-tint px-4 py-3 text-left"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-gopay-deep">
              <FileCheck2 size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">{t(DIRA_ENTRY_CARD.title)}</span>
              <span className="block text-xs text-ink-soft">{t(DIRA_ENTRY_CARD.body)}</span>
            </span>
            <ArrowRight size={18} className="shrink-0 text-gopay-deep" />
          </button>
        ) : null}
      </PhoneBody>
      <PhoneFooter>
        <div className="flex flex-wrap gap-2">
          {DIRA_QUICK_REPLIES.map((reply) => (
            <Button key={reply.id} variant="secondary" size="sm" onClick={() => ask(reply)}>
              {t(reply.label)}
            </Button>
          ))}
        </div>
      </PhoneFooter>
    </>
  );
}
