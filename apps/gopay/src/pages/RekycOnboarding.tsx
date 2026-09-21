import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { captureCopy } from "@/data/copy-config";

export function RekycOnboardingPage() {
  const navigate = useNavigate();
  const copy = captureCopy.rekyc;
  return (
    <ConsumerLayout title="Onboarding" showNav={false}>
      <AppHeader title={copy.eyebrow} onBack={() => navigate("/app/rekyc/fr")} />
      <div className="flex flex-1 flex-col px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gopay">{copy.eyebrow}</p>
        <h2 className="mt-2 text-2xl font-extrabold leading-tight">{copy.title}</h2>
        <ol className="mt-6 space-y-3">
          {copy.body.map((line) => (
            <li key={line} className="rounded-2xl bg-surface px-4 py-3 text-sm text-ink-soft">
              {line}
            </li>
          ))}
        </ol>
        <Button className="mt-auto w-full" onClick={() => navigate("/app/rekyc/capture")}>
          {copy.cta}
        </Button>
      </div>
    </ConsumerLayout>
  );
}
