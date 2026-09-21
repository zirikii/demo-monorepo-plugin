import type { StoreSnapshot } from "@/types/account";
import type { DemoScenario, RekycSession } from "@/types/rekyc";
import { demoAccount } from "@/data/identity";
import { seedSubmissions } from "@/data/submissions-seed";
import { sariIdentity } from "@/data/identity";

const STORE_KEY = "gopay-rekyc-store";
const SESSION_KEY = "gopay-rekyc-session";
const SCENARIO_KEY = "gopay-rekyc-scenario";

export const defaultScenario: DemoScenario = {
  frPass: true,
  capturedNik: sariIdentity.nik,
  ocrConfidence: 0.94,
  riskTier: "medium",
  dukcapilCacheConfidence: 0.91,
  dukcapilRerunVerified: true,
};

export const defaultStore = (): StoreSnapshot => ({
  account: demoAccount,
  submissions: seedSubmissions,
  callbacks: [],
  notifications: [],
  blockEnforcement: false,
  blockRiskScope: ["high"],
  blockOverdueDays: 30,
  oddBannerLeadDays: 30,
});

export function readStore(): StoreSnapshot {
  if (typeof window === "undefined") return defaultStore();
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    return { ...defaultStore(), ...(JSON.parse(raw) as Partial<StoreSnapshot>) };
  } catch {
    return defaultStore();
  }
}

export function writeStore(store: StoreSnapshot): void {
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function readRekycSession(): RekycSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as RekycSession) : null;
  } catch {
    return null;
  }
}

export function writeRekycSession(session: RekycSession | null): void {
  if (!session) {
    window.localStorage.removeItem(SESSION_KEY);
    return;
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function readScenario(): DemoScenario {
  if (typeof window === "undefined") return defaultScenario;
  try {
    const raw = window.localStorage.getItem(SCENARIO_KEY);
    return raw ? { ...defaultScenario, ...(JSON.parse(raw) as Partial<DemoScenario>) } : defaultScenario;
  } catch {
    return defaultScenario;
  }
}

export function writeScenario(scenario: DemoScenario): void {
  window.localStorage.setItem(SCENARIO_KEY, JSON.stringify(scenario));
}

export function resetDemo(): void {
  window.localStorage.removeItem(STORE_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(SCENARIO_KEY);
}
