import { useContext } from "react";
import { DemoContext, type DemoContextValue } from "./context";

export function useDemo(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemo must be used inside <DemoProvider>");
  }
  return context;
}
