import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { PhoneAppBar, PhoneBody, PhoneFooter } from "@/components/phone/PhoneScreen";
import { Button } from "@/components/ui/Button";
import { EDD_QUESTIONS } from "@/data/edd";
import { S } from "@/data/strings";
import { cn } from "@/lib/cn";
import { useDemo } from "@/state/useDemo";

/** High-risk sessions must complete EDD before the attempt can be approved. */
export function EddQuestionnaire() {
  const { state, dispatch, t } = useDemo();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const complete = EDD_QUESTIONS.every((question) => answers[question.id]);

  if (!state.session) return <Navigate to="/app/vac" replace />;

  function submit() {
    dispatch({ type: "submitEdd", answers });
    navigate("/app/rekyc/processing");
  }

  return (
    <>
      <PhoneAppBar title={t(S.eddTitle)} />
      <PhoneBody className="space-y-5">
        <p className="text-sm text-ink-soft">{t(S.eddBody)}</p>
        {EDD_QUESTIONS.map((question) => (
          <fieldset key={question.id} className="space-y-2">
            <legend className="text-sm font-bold">{t(question.prompt)}</legend>
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => {
                const value = option.en;
                const selected = answers[question.id] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: value }))}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      selected
                        ? "border-gopay bg-gopay-tint text-gopay-deep"
                        : "border-line bg-white text-ink-soft",
                    )}
                  >
                    {t(option)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </PhoneBody>
      <PhoneFooter>
        <Button block size="lg" data-testid="edd-submit" disabled={!complete} onClick={submit}>
          {t(S.eddCta)}
        </Button>
      </PhoneFooter>
    </>
  );
}
