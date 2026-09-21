import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { SCENARIO_PRESETS, type Scenario } from "@/domain/scenario";
import type { RiskTier } from "@/domain/types";
import { useDemo } from "@/state/useDemo";

const TIERS: RiskTier[] = ["low", "medium", "high"];

export function ScenarioConsole() {
  const { state, dispatch } = useDemo();
  const { scenario } = state;

  function patch(next: Partial<Scenario>) {
    dispatch({ type: "patchScenario", patch: next });
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-4 px-6 py-8">
      <div>
        <h1 className="text-xl font-extrabold">Scenario console</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Every external system in this demo is simulated. Set the outcomes here, then run the flow
          in the app.
        </p>
      </div>

      <Card>
        <CardHeader title="Presets" description="One click per PRD branch." />
        <CardBody className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SCENARIO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => patch(preset.patch)}
              data-testid={`preset-${preset.id}`}
              className="rounded-xl border border-line px-3 py-2.5 text-left transition-colors hover:border-gopay hover:bg-gopay-tint"
            >
              <span className="block text-xs font-bold text-ink">{preset.label}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-ink-soft">
                {preset.description}
              </span>
            </button>
          ))}
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Face recognition" />
          <CardBody>
            <Slider
              label="FR match score"
              value={scenario.frMatchScore}
              min={0}
              max={1}
              step={0.01}
              hint={`Threshold ${scenario.thresholds.frMatch} — below this the flow never reaches capture.`}
              onChange={(frMatchScore) => patch({ frMatchScore })}
            />
            <Toggle
              checked={scenario.reuseFrSelfie}
              onChange={(reuseFrSelfie) => patch({ reuseFrSelfie })}
              label="Reuse the FR selfie"
              description="Skips the selfie capture screen and reuses the FR image."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="OCR & NIK" />
          <CardBody>
            <Toggle
              checked={scenario.ocrNikMatchesOnFile}
              onChange={(ocrNikMatchesOnFile) => patch({ ocrNikMatchesOnFile })}
              label="OCR NIK matches the account"
              description="Turn off to reject locally with rekyc_id_mismatch (no Dukcapil call)."
            />
            <Slider
              label="OCR confidence"
              value={scenario.ocrConfidence}
              min={0}
              max={1}
              step={0.01}
              hint={`Threshold ${scenario.thresholds.ocrConfidence} — below this goes to manual review.`}
              onChange={(ocrConfidence) => patch({ ocrConfidence })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Screening & risk" />
          <CardBody className="space-y-2">
            <Toggle
              checked={scenario.nameScreeningHit}
              onChange={(nameScreeningHit) => patch({ nameScreeningHit })}
              label="Name screening hit"
              description="Routes the submission to an agent instead of auto-deciding."
            />
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="text-sm font-semibold">Risk tier</span>
              <SegmentedControl<RiskTier>
                ariaLabel="Risk tier"
                value={scenario.riskTier}
                onChange={(riskTier) =>
                  patch({
                    riskTier,
                    riskScore: riskTier === "high" ? 82 : riskTier === "medium" ? 55 : 18,
                  })
                }
                options={TIERS.map((tier) => ({ value: tier, label: tier }))}
              />
            </div>
            <Slider
              label="Risk score"
              value={scenario.riskScore}
              min={0}
              max={100}
              step={1}
              format={(value) => String(value)}
              onChange={(riskScore) => patch({ riskScore })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Dukcapil" />
          <CardBody>
            <Slider
              label="Cached face confidence"
              value={scenario.dukcapilFaceConfidence}
              min={0}
              max={1}
              step={0.01}
              hint={`Threshold ${scenario.thresholds.dukcapilFaceConfidence} — at or above it the cache is reused and verification is skipped.`}
              onChange={(dukcapilFaceConfidence) => patch({ dukcapilFaceConfidence })}
            />
            <Toggle
              checked={scenario.dukcapilVerified}
              onChange={(dukcapilVerified) => patch({ dukcapilVerified })}
              label="Dukcapil re-run verifies"
              description="Only used when the cached confidence is below threshold."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="ODD & block enforcement (Phase 2)" />
          <CardBody className="space-y-2">
            <Slider
              label="ODD due in days"
              value={scenario.oddDueInDays}
              min={-120}
              max={540}
              step={1}
              format={(value) => `${value}d`}
              hint="Negative values are past due. The reminder banner appears 30 days out."
              onChange={(oddDueInDays) => patch({ oddDueInDays })}
            />
            <Toggle
              checked={scenario.block.enabled}
              onChange={(enabled) => patch({ block: { ...scenario.block, enabled } })}
              label="Block enforcement"
              description="Independent of the reminder banner."
            />
            <div className="flex flex-wrap items-center gap-2 py-2">
              <span className="text-sm font-semibold">Scoped tiers</span>
              {TIERS.map((tier) => {
                const active = scenario.block.scopeTiers.includes(tier);
                return (
                  <button
                    key={tier}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      patch({
                        block: {
                          ...scenario.block,
                          scopeTiers: active
                            ? scenario.block.scopeTiers.filter((item) => item !== tier)
                            : [...scenario.block.scopeTiers, tier],
                        },
                      })
                    }
                    className={
                      active
                        ? "rounded-full border border-gopay bg-gopay-tint px-3 py-1 text-xs font-bold text-gopay-deep"
                        : "rounded-full border border-line px-3 py-1 text-xs font-semibold text-ink-soft"
                    }
                  >
                    {tier}
                  </button>
                );
              })}
            </div>
            <Slider
              label="Blocked after days past due"
              value={scenario.block.scopeDaysPastDue}
              min={0}
              max={120}
              step={1}
              format={(value) => `${value}d`}
              onChange={(scopeDaysPastDue) => patch({ block: { ...scenario.block, scopeDaysPastDue } })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Screen options" />
          <CardBody>
            <Toggle
              checked={scenario.notMineEntryEnabled}
              onChange={(notMineEntryEnabled) => patch({ notMineEntryEnabled })}
              label='Show "this e-KTP is not mine"'
              description="PRD 4.2 specifies it; the 26 Aug meeting notes say to drop it. Toggle to see both readings."
            />
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => dispatch({ type: "resetDemo" })}>
          Reset ledger and session
        </Button>
      </div>
    </div>
  );
}
