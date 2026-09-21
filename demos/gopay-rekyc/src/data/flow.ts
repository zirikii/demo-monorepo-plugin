export interface FlowNode {
  id: string;
  label: string;
  detail: string;
  kind: "entry" | "screen" | "check" | "outcome";
  route?: string;
}

export interface FlowLane {
  id: string;
  title: string;
  nodes: FlowNode[];
}

/** PRD section 3 flow diagram, reconstructed from the written requirements. */
export const FLOW_LANES: FlowLane[] = [
  {
    id: "entry",
    title: "1 · Entry points",
    nodes: [
      {
        id: "vac",
        label: "Verified Account Center",
        detail: 'Row inside the existing "Identitas terverifikasi" card',
        kind: "entry",
        route: "/app/vac",
      },
      {
        id: "dira",
        label: "Dira",
        detail: "KTP-data help request answered with a re-KYC entry point, not a CCU ticket",
        kind: "entry",
        route: "/app/dira",
      },
      {
        id: "odd",
        label: "ODD reminder (Phase 2)",
        detail: "Banner from N days before the review due date",
        kind: "entry",
        route: "/app/odd/confirm",
      },
    ],
  },
  {
    id: "review",
    title: "2 · Context",
    nodes: [
      {
        id: "review",
        label: "e-KTP data review",
        detail: "Masked data, collapsed by default, one primary CTA",
        kind: "screen",
        route: "/app/rekyc/review",
      },
      {
        id: "not-mine",
        label: "This e-KTP is not mine",
        detail: "Help article in the in-app browser — no session, no FR, no Dukcapil",
        kind: "outcome",
        route: "/app/rekyc/help/not-mine",
      },
      {
        id: "exit",
        label: "Exit without starting",
        detail: "No session, no write-back, no status change",
        kind: "outcome",
      },
    ],
  },
  {
    id: "capture",
    title: "3 · Prove and capture",
    nodes: [
      {
        id: "fr",
        label: "On-demand FR gate",
        detail: "Live selfie matched against the on-file face record before any capture screen",
        kind: "check",
        route: "/app/rekyc/fr",
      },
      {
        id: "onboarding",
        label: "OneKYC capture onboarding",
        detail: "Existing screen, copy resolved from a config keyed by entry context",
        kind: "screen",
        route: "/app/rekyc/onboarding",
      },
      {
        id: "ktp",
        label: "KTP capture",
        detail: "Selfie step skipped when the FR image is reused",
        kind: "screen",
        route: "/app/rekyc/capture/ktp",
      },
    ],
  },
  {
    id: "verify",
    title: "4 · Verification sequence",
    nodes: [
      {
        id: "nik",
        label: "Local NIK match",
        detail: "Mismatch → rekyc_id_mismatch, rejected locally, no Dukcapil call",
        kind: "check",
      },
      {
        id: "ocr",
        label: "OCR confidence",
        detail: "Below threshold → manual review queue and an explicit pending state",
        kind: "check",
      },
      {
        id: "screening",
        label: "Name screening → risk scoring",
        detail: "Run in sequence, always fresh — no cached result reused",
        kind: "check",
      },
      {
        id: "edd",
        label: "EDD when high risk",
        detail: "Must be completed before the session can be approved",
        kind: "check",
        route: "/app/rekyc/edd",
      },
      {
        id: "dukcapil",
        label: "Dukcapil cache",
        detail:
          "Above confidence → reuse cached record; below → re-run; verified replaces data, not verified rejects",
        kind: "check",
      },
    ],
  },
  {
    id: "outcome",
    title: "5 · Outcome",
    nodes: [
      {
        id: "approved",
        label: "Approved",
        detail:
          "New submission approved, previous superseded, ODD interval reset, partners notified, toast on the VAC page",
        kind: "outcome",
        route: "/app/vac",
      },
      {
        id: "pending",
        label: "Pending manual review",
        detail: "Agent decides in the E-Money Portal",
        kind: "outcome",
        route: "/portal",
      },
      {
        id: "rejected",
        label: "Rejected",
        detail: "Nothing else changes: not the account status, the data in use, or the risk tier",
        kind: "outcome",
      },
    ],
  },
];
