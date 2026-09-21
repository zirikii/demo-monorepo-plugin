import { useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { Bilingual } from "@/domain/pipeline";
import { DEFAULT_SCENARIO, type Scenario } from "@/domain/scenario";
import { readStored, writeStored } from "@/lib/storage";
import { pick } from "@/data/strings";
import { DemoContext, type DemoContextValue } from "./context";
import { createInitialState, demoReducer } from "./reducer";
import type { DemoState } from "./types";

const SCENARIO_KEY = "scenario";
const LOCALE_KEY = "locale";

function init(): DemoState {
  const now = new Date().toISOString();
  const scenario = readStored<Scenario>(SCENARIO_KEY, DEFAULT_SCENARIO);
  const state = createInitialState(now, { ...DEFAULT_SCENARIO, ...scenario });
  return { ...state, locale: readStored<DemoState["locale"]>(LOCALE_KEY, "id") };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, init);

  useEffect(() => {
    writeStored(SCENARIO_KEY, state.scenario);
  }, [state.scenario]);

  useEffect(() => {
    writeStored(LOCALE_KEY, state.locale);
  }, [state.locale]);

  const value = useMemo<DemoContextValue>(
    () => ({ state, dispatch, t: (bilingual: Bilingual) => pick(bilingual, state.locale) }),
    [state],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
