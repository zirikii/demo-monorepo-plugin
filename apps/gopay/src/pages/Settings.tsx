import { useNavigate } from "react-router-dom";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRekyc } from "@/hooks/useRekyc";
import type { RiskTier } from "@/types/submission";

export function SettingsPage() {
  const { logout } = useAuth();
  const { store, setStore, scenario, setScenario, reset } = useRekyc();
  const navigate = useNavigate();

  return (
    <ConsumerLayout title="Setelan">
      <AppHeader title="Setelan demo" onBack={() => navigate("/app")} />
      <div className="space-y-5 px-4 py-4 text-sm">
        <label className="flex items-center justify-between">
          <span>FR lolos</span>
          <input
            type="checkbox"
            checked={scenario.frPass}
            onChange={(e) => setScenario({ ...scenario, frPass: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between">
          <span>Blokir akun overdue</span>
          <input
            type="checkbox"
            checked={store.blockEnforcement}
            onChange={(e) => setStore({ ...store, blockEnforcement: e.target.checked })}
          />
        </label>
        <label className="block">
          Risiko simulasi
          <select
            className="mt-1 w-full rounded-2xl border border-line px-3 py-2"
            value={scenario.riskTier}
            onChange={(e) => setScenario({ ...scenario, riskTier: e.target.value as RiskTier })}
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high (EDD)</option>
          </select>
        </label>
        <Button variant="secondary" className="w-full" onClick={() => reset()}>
          Reset data demo
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Keluar
        </Button>
      </div>
    </ConsumerLayout>
  );
}
