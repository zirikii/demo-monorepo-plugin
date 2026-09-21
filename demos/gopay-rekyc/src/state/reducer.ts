import { makeInitialLedger } from "@/data/account";
import { MISMATCHED_IDENTITY, UPDATED_IDENTITY } from "@/data/identity";
import { SUCCESS_NOTIFICATIONS, SUCCESS_TOAST } from "@/domain/notifications";
import {
  appendSubmission,
  approveSubmission,
  overrideDecision as overrideLedgerDecision,
  rejectSubmission,
} from "@/domain/ledger";
import { frPasses, runPipeline } from "@/domain/pipeline";
import { DEFAULT_SCENARIO, type Scenario } from "@/domain/scenario";
import type { Ledger, Submission } from "@/domain/types";
import { makeId } from "@/lib/id";
import { pick } from "@/data/strings";
import type { ActivityEntry, DemoAction, DemoState, ReKycSession } from "./types";

function log(state: DemoState, channel: ActivityEntry["channel"], message: string): ActivityEntry {
  return { id: makeId("act"), at: state.now, channel, message };
}

function withActivity(state: DemoState, entries: ActivityEntry[]): ActivityEntry[] {
  return [...entries, ...state.activity].slice(0, 80);
}

function dueDateFrom(nowIso: string, days: number): string {
  const due = new Date(nowIso);
  due.setDate(due.getDate() + days);
  return due.toISOString();
}

export function createInitialState(nowIso: string, scenario: Scenario = DEFAULT_SCENARIO): DemoState {
  return {
    locale: "id",
    now: nowIso,
    scenario,
    ledger: makeInitialLedger(nowIso, scenario.oddDueInDays),
    session: null,
    toasts: [],
    genieVisible: false,
    pushNotifications: [],
    activity: [
      {
        id: makeId("act"),
        at: nowIso,
        channel: "system",
        message: "Demo reset — account holds one approved initial KYC submission",
      },
    ],
    oddConfirmedAt: null,
  };
}

function newSession(state: DemoState, entryPoint: DemoState["scenario"]["entryPoint"]): ReKycSession {
  return {
    id: makeId("ses"),
    entryPoint,
    startedAt: state.now,
    frPassed: null,
    frSelfieId: null,
    ktpImageId: null,
    selfieImageId: null,
    selfieSource: null,
    capturedIdentity: null,
    eddAnswers: {},
    eddCompleted: false,
    result: null,
    submissionId: null,
  };
}

function buildSubmission(state: DemoState, session: ReKycSession): Submission {
  const result = session.result;
  if (!result || !session.capturedIdentity) {
    throw new Error("cannot build a submission before the pipeline has run");
  }
  return {
    id: makeId("sub"),
    accountId: state.ledger.account.accountId,
    type: "reverification",
    status: "pending_review",
    submittedAt: state.now,
    decidedAt: null,
    decidedBy: null,
    rejectionReason: null,
    data: session.capturedIdentity,
    documents: {
      ktpImageId: session.ktpImageId ?? "img_ktp_pending",
      selfieImageId: session.selfieImageId ?? session.frSelfieId ?? "img_selfie_pending",
      selfieSource: session.selfieSource ?? "selfie_capture",
    },
    riskScore: state.scenario.riskScore,
    riskTier: state.scenario.riskTier,
    system: result.system,
  };
}

function applyDecision(state: DemoState, session: ReKycSession): DemoState {
  const result = session.result;
  if (!result) return state;

  const submission = buildSubmission(state, session);
  let ledger: Ledger = appendSubmission(state.ledger, submission);
  const entries: ActivityEntry[] = [
    log(state, "ledger", `submission ${submission.id} created (reverification, immutable data)`),
  ];
  let toasts = state.toasts;
  let genieVisible = state.genieVisible;
  let pushNotifications = state.pushNotifications;

  switch (result.decision.kind) {
    case "approved": {
      const tx = approveSubmission(ledger, submission.id, { actor: "system", at: state.now });
      ledger = tx.ledger;
      entries.push(...tx.effects.map((effect) => log(state, "ledger", effect)));
      for (const event of tx.ledger.partnerEvents.slice(state.ledger.partnerEvents.length)) {
        entries.push(
          log(state, "partner", `${event.partner} ← ${event.event} (account id + timestamp only)`),
        );
      }
      toasts = [
        ...toasts,
        { id: makeId("toast"), text: pick(SUCCESS_TOAST, state.locale), tone: "success" as const },
      ];
      genieVisible = true;
      const push = SUCCESS_NOTIFICATIONS.find((item) => item.channel === "push");
      if (push) {
        pushNotifications = [
          {
            id: makeId("push"),
            title: "GoPay",
            body: pick(push.body, state.locale),
            sentAt: state.now,
            apps: ["Gopay", "Gojek", "GMA"],
          },
          ...pushNotifications,
        ];
      }
      break;
    }
    case "rejected": {
      const tx = rejectSubmission(ledger, submission.id, {
        actor: "system",
        at: state.now,
        reason: result.decision.reason,
      });
      ledger = tx.ledger;
      entries.push(...tx.effects.map((effect) => log(state, "ledger", effect)));
      break;
    }
    case "manual_review": {
      entries.push(
        log(
          state,
          "system",
          `submission ${submission.id} routed to manual review (${result.decision.trigger})`,
        ),
      );
      break;
    }
    case "edd_required":
      return state;
    default: {
      const exhaustive: never = result.decision;
      throw new Error(`unhandled decision ${JSON.stringify(exhaustive)}`);
    }
  }

  return {
    ...state,
    ledger,
    session: { ...session, submissionId: submission.id },
    toasts,
    genieVisible,
    pushNotifications,
    activity: withActivity(state, entries),
  };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "setLocale":
      return { ...state, locale: action.locale };

    case "patchScenario": {
      const scenario = { ...state.scenario, ...action.patch };
      const oddChanged =
        action.patch.oddDueInDays !== undefined &&
        action.patch.oddDueInDays !== state.scenario.oddDueInDays;
      const ledger = oddChanged
        ? {
            ...state.ledger,
            account: {
              ...state.ledger.account,
              oddDueAt: dueDateFrom(state.now, scenario.oddDueInDays),
            },
          }
        : state.ledger;
      return {
        ...state,
        scenario,
        ledger,
        activity: withActivity(state, [
          log(state, "system", `scenario updated: ${Object.keys(action.patch).join(", ")}`),
        ]),
      };
    }

    case "resetDemo":
      return createInitialState(state.now, state.scenario);

    case "startSession": {
      const session = newSession(state, action.entryPoint);
      return {
        ...state,
        session,
        activity: withActivity(state, [
          log(state, "session", `re-KYC session ${session.id} started from ${action.entryPoint}`),
        ]),
      };
    }

    case "abandonSession":
      return {
        ...state,
        session: null,
        activity: withActivity(state, [
          log(
            state,
            "session",
            "user exited before starting — no session, no write-back, no status change",
          ),
        ]),
      };

    case "completeFr": {
      if (!state.session) return state;
      const passed = frPasses(state.scenario);
      const session: ReKycSession = {
        ...state.session,
        frPassed: passed,
        frSelfieId: passed ? makeId("img_fr_selfie") : null,
      };
      return {
        ...state,
        session,
        activity: withActivity(state, [
          log(
            state,
            "session",
            passed
              ? `FR passed (${state.scenario.frMatchScore.toFixed(2)}) — capture unlocked`
              : `FR failed (${state.scenario.frMatchScore.toFixed(2)}) — capture blocked, record untouched`,
          ),
        ]),
      };
    }

    case "captureKtp": {
      if (!state.session || state.session.frPassed !== true) return state;
      const identity = state.scenario.ocrNikMatchesOnFile ? UPDATED_IDENTITY : MISMATCHED_IDENTITY;
      const reuse = state.scenario.reuseFrSelfie && state.session.frSelfieId !== null;
      const session: ReKycSession = {
        ...state.session,
        ktpImageId: makeId("img_ktp"),
        capturedIdentity: identity,
        selfieImageId: reuse ? state.session.frSelfieId : null,
        selfieSource: reuse ? "fr_reuse" : null,
      };
      return {
        ...state,
        session,
        activity: withActivity(state, [
          log(
            state,
            "session",
            reuse
              ? "e-KTP captured; selfie step skipped, FR image reused"
              : "e-KTP captured; selfie capture required",
          ),
        ]),
      };
    }

    case "captureSelfie": {
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          selfieImageId: makeId("img_selfie"),
          selfieSource: "selfie_capture",
        },
      };
    }

    case "submitEdd": {
      if (!state.session) return state;
      const session: ReKycSession = {
        ...state.session,
        eddAnswers: action.answers,
        eddCompleted: true,
      };
      return {
        ...state,
        session,
        activity: withActivity(state, [log(state, "session", "EDD answers collected")]),
      };
    }

    case "runVerification": {
      if (!state.session || !state.session.capturedIdentity) return state;
      const result = runPipeline({
        scenario: state.scenario,
        onFileNik: state.ledger.submissions.find((s) => s.status === "approved")?.data.nik ?? "",
        capturedNik: state.session.capturedIdentity.nik,
        eddCompleted: state.session.eddCompleted,
        entryPoint: state.session.entryPoint,
      });
      const session = { ...state.session, result };
      const next = { ...state, session };
      if (result.decision.kind === "edd_required") {
        return {
          ...next,
          activity: withActivity(state, [
            log(state, "session", "high risk — EDD required before the session can be approved"),
          ]),
        };
      }
      return applyDecision(next, session);
    }

    case "overrideDecision": {
      const tx = overrideLedgerDecision(state.ledger, action.submissionId, action.status, {
        at: state.now,
      });
      return {
        ...state,
        ledger: tx.ledger,
        activity: withActivity(state, [
          ...tx.effects.map((effect) => log(state, "ledger", effect)),
          log(state, "ledger", "agent override changed a decision — no new submission created"),
        ]),
      };
    }

    case "confirmOddUnchanged":
      return {
        ...state,
        oddConfirmedAt: state.now,
        toasts: [
          ...state.toasts,
          {
            id: makeId("toast"),
            text: state.locale === "id" ? "Data kamu sudah dikonfirmasi" : "Your data is confirmed",
            tone: "success",
          },
        ],
        activity: withActivity(state, [
          log(state, "session", "user confirmed e-KTP data is unchanged (ODD confirmation screen)"),
        ]),
      };

    case "dismissGenie":
      return { ...state, genieVisible: false };

    case "dismissToast":
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) };

    case "pushToast":
      return {
        ...state,
        toasts: [...state.toasts, { id: makeId("toast"), text: action.text, tone: action.tone }],
      };

    default: {
      const exhaustive: never = action;
      throw new Error(`unhandled action ${JSON.stringify(exhaustive)}`);
    }
  }
}
