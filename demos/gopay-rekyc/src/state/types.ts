import type { PipelineResult } from "@/domain/pipeline";
import type { Scenario } from "@/domain/scenario";
import type {
  EntryPoint,
  IdentityData,
  Ledger,
  Locale,
  SelfieSource,
  SubmissionStatus,
} from "@/domain/types";

export interface ReKycSession {
  id: string;
  entryPoint: EntryPoint;
  startedAt: string;
  frPassed: boolean | null;
  frSelfieId: string | null;
  ktpImageId: string | null;
  selfieImageId: string | null;
  selfieSource: SelfieSource | null;
  capturedIdentity: IdentityData | null;
  eddAnswers: Record<string, string>;
  eddCompleted: boolean;
  result: PipelineResult | null;
  submissionId: string | null;
}

export interface ToastMessage {
  id: string;
  text: string;
  tone: "success" | "info" | "danger";
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  sentAt: string;
  apps: string[];
}

export interface ActivityEntry {
  id: string;
  at: string;
  channel: "session" | "ledger" | "partner" | "system";
  message: string;
}

export interface DemoState {
  locale: Locale;
  now: string;
  scenario: Scenario;
  ledger: Ledger;
  session: ReKycSession | null;
  toasts: ToastMessage[];
  genieVisible: boolean;
  pushNotifications: PushNotification[];
  activity: ActivityEntry[];
  oddConfirmedAt: string | null;
}

export type DemoAction =
  | { type: "setLocale"; locale: Locale }
  | { type: "patchScenario"; patch: Partial<Scenario> }
  | { type: "resetDemo" }
  | { type: "resetLedger" }
  | { type: "startSession"; entryPoint: EntryPoint }
  | { type: "abandonSession" }
  | { type: "completeFr" }
  | { type: "captureKtp" }
  | { type: "captureSelfie" }
  | { type: "submitEdd"; answers: Record<string, string> }
  | { type: "runVerification" }
  | { type: "overrideDecision"; submissionId: string; status: SubmissionStatus }
  | { type: "confirmOddUnchanged" }
  | { type: "dismissGenie" }
  | { type: "dismissToast"; id: string }
  | { type: "pushToast"; text: string; tone: ToastMessage["tone"] };
