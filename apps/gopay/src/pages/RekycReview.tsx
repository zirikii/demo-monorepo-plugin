import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { DataReviewList } from "@/components/rekyc/DataReviewList";
import { reviewCopy } from "@/data/copy-config";
import { useRekyc } from "@/hooks/useRekyc";

export function RekycReviewPage() {
  const { store, setSession } = useRekyc();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  function exitWithoutSession() {
    setSession(null);
    navigate("/app/vac");
  }

  function startUpdate() {
    setSession({
      id: `rekyc_${Date.now()}`,
      startedAt: new Date().toISOString(),
    });
    navigate("/app/rekyc/fr");
  }

  return (
    <ConsumerLayout title="Data e-KTP" showNav={false}>
      <AppHeader title={reviewCopy.title} onBack={exitWithoutSession} />
      <div className="flex flex-col gap-4 px-4 py-4">
        <p className="text-sm text-ink-soft">{reviewCopy.explainer}</p>
        <DataReviewList identity={store.account.identityOnFile} expanded={expanded} />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-semibold text-gopay"
        >
          {expanded ? reviewCopy.seeLess : reviewCopy.seeMore}
        </button>
        <button
          type="button"
          onClick={() => navigate("/app/help/ektp-bukan-milik-saya")}
          className="text-left text-sm font-semibold text-ink-soft underline"
        >
          {reviewCopy.notMineId}
        </button>
        <div className="mt-auto pt-4">
          <Button className="w-full" onClick={startUpdate}>
            {reviewCopy.primaryCtaId}
          </Button>
          <p className="mt-2 text-center text-[11px] text-ink-faint">{reviewCopy.primaryCta}</p>
        </div>
      </div>
    </ConsumerLayout>
  );
}
