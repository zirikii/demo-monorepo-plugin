import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { eddQuestions } from "@/data/edd";
import { updatedIdentity } from "@/data/identity";
import { useRekyc } from "@/hooks/useRekyc";
import { applyDecision } from "@/lib/rekyc-engine";

export function RekycEddPage() {
  const { store, setStore, session, setSession, scenario } = useRekyc();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Record<string, string>>();

  const onSubmit = handleSubmit((answers) => {
    const withEdd = {
      ...(session ?? { id: "edd", startedAt: new Date().toISOString() }),
      eddAnswers: answers,
    };
    setSession(withEdd);
    const dukcapilOk = scenario.dukcapilCacheConfidence >= 0.85 || scenario.dukcapilRerunVerified;
    const decision = dukcapilOk
      ? ({ kind: "approved", reusedDukcapilCache: scenario.dukcapilCacheConfidence >= 0.85 } as const)
      : ({ kind: "dukcapil_rejected" } as const);
    const next = applyDecision({
      account: store.account,
      submissions: store.submissions,
      callbacks: store.callbacks,
      notifications: store.notifications,
      decision,
      proposedIdentity: updatedIdentity,
      scenario,
    });
    setStore({ ...store, ...next });
    setSession(null);
    navigate(decision.kind === "approved" ? "/app/vac" : "/app/rekyc/reject");
  });

  return (
    <ConsumerLayout title="EDD" showNav={false}>
      <AppHeader title="Pertanyaan tambahan" onBack={() => navigate("/app/rekyc/capture")} />
      <form className="flex flex-1 flex-col gap-4 px-5 py-5" onSubmit={onSubmit}>
        <p className="text-sm text-ink-soft">
          Skor risiko tinggi. EDD harus selesai sebelum sesi bisa disetujui.
        </p>
        {eddQuestions.map((q) => (
          <label key={q.id} className="block text-sm font-semibold">
            {q.label}
            <select
              className="mt-1.5 w-full rounded-2xl border border-line px-3 py-3 font-normal"
              defaultValue={q.options[0]}
              {...register(q.id)}
            >
              {q.options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>
        ))}
        <Button type="submit" className="mt-auto w-full">
          Kirim EDD
        </Button>
      </form>
    </ConsumerLayout>
  );
}
