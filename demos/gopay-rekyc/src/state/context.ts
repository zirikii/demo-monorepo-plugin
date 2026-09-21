import { createContext } from "react";
import type { Dispatch } from "react";
import type { Bilingual } from "@/domain/pipeline";
import type { DemoAction, DemoState } from "./types";

export interface DemoContextValue {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  t: (value: Bilingual) => string;
}

export const DemoContext = createContext<DemoContextValue | null>(null);
