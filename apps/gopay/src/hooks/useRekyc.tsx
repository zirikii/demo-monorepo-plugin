import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StoreSnapshot } from "@/types/account";
import type { DemoScenario, RekycSession } from "@/types/rekyc";
import {
  defaultScenario,
  readRekycSession,
  readScenario,
  readStore,
  resetDemo,
  writeRekycSession,
  writeScenario,
  writeStore,
} from "@/lib/storage";

type RekycContextValue = {
  store: StoreSnapshot;
  setStore: (next: StoreSnapshot) => void;
  session: RekycSession | null;
  setSession: (next: RekycSession | null) => void;
  scenario: DemoScenario;
  setScenario: (next: DemoScenario) => void;
  reset: () => void;
};

const RekycContext = createContext<RekycContextValue | null>(null);

export function RekycProvider({ children }: { children: ReactNode }) {
  const [store, setStoreState] = useState<StoreSnapshot>(() => readStore());
  const [session, setSessionState] = useState<RekycSession | null>(() => readRekycSession());
  const [scenario, setScenarioState] = useState<DemoScenario>(() => readScenario());

  const setStore = useCallback((next: StoreSnapshot) => {
    setStoreState(next);
    writeStore(next);
  }, []);

  const setSession = useCallback((next: RekycSession | null) => {
    setSessionState(next);
    writeRekycSession(next);
  }, []);

  const setScenario = useCallback((next: DemoScenario) => {
    setScenarioState(next);
    writeScenario(next);
  }, []);

  const reset = useCallback(() => {
    resetDemo();
    setStoreState(readStore());
    setSessionState(null);
    setScenarioState(defaultScenario);
  }, []);

  const value = useMemo(
    () => ({ store, setStore, session, setSession, scenario, setScenario, reset }),
    [store, setStore, session, setSession, scenario, setScenario, reset],
  );

  return <RekycContext.Provider value={value}>{children}</RekycContext.Provider>;
}

export function useRekyc(): RekycContextValue {
  const ctx = useContext(RekycContext);
  if (!ctx) throw new Error("useRekyc must be used within RekycProvider");
  return ctx;
}
