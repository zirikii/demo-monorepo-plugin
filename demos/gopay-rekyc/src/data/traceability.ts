export type CoverageStatus = "implemented" | "simulated" | "interpreted" | "backend_only";

export interface CoverageItem {
  section: string;
  requirement: string;
  criterion: string;
  status: CoverageStatus;
  where: string;
  route?: string;
  note?: string;
}

export const COVERAGE: CoverageItem[] = [
  {
    section: "4.1",
    requirement: "Self-initiated update",
    criterion:
      'A row inside the existing "Identitas terverifikasi" card on the Pusat Akun Terverifikasi screen starts the update.',
    status: "implemented",
    where: "pages/app/VerifiedAccountCenter.tsx",
    route: "/app/vac",
  },
  {
    section: "4.1",
    requirement: "Self-initiated update",
    criterion:
      "The card shows NIK, full name, address, occupation and marital status (masked); only NIK and full name are visible until expanded.",
    status: "implemented",
    where: "data/fields.ts · VAC_DEFAULT_FIELDS / VAC_MORE_FIELDS",
    route: "/app/vac",
  },
  {
    section: "4.1",
    requirement: "Dira",
    criterion:
      "A KTP-data help request is answered with an entry point into the re-KYC flow rather than a CCU ticket.",
    status: "implemented",
    where: "pages/app/Dira.tsx",
    route: "/app/dira",
  },
  {
    section: "4.2",
    requirement: "e-KTP data review screen",
    criterion:
      "An explanatory line states this is the e-KTP data on file and to continue only if it no longer matches the physical card.",
    status: "implemented",
    where: "data/strings.ts · S.reviewExplainer",
    route: "/app/rekyc/review",
  },
  {
    section: "4.2",
    requirement: "e-KTP data review screen",
    criterion:
      'Opens collapsed on name, NIK, DOB, occupation, address and marital status — all masked — with a "See more data" control.',
    status: "implemented",
    where: "data/fields.ts · REVIEW_COLLAPSED_FIELDS",
    route: "/app/rekyc/review",
  },
  {
    section: "4.2",
    requirement: "e-KTP data review screen",
    criterion:
      'Expanding reveals RT/RW, kelurahan, kecamatan, religion and gender, still masked, and the control becomes "See less data".',
    status: "implemented",
    where: "pages/app/ReviewEktp.tsx",
    route: "/app/rekyc/review",
  },
  {
    section: "4.2",
    requirement: "e-KTP data review screen",
    criterion: "Exactly one CTA is rendered in either state.",
    status: "interpreted",
    where: "pages/app/ReviewEktp.tsx · review-cta",
    route: "/app/rekyc/review",
    note: 'One primary CTA button. The "this e-KTP is not mine" report is rendered as a secondary text link, since the same section requires it; it can be switched off in the scenario console.',
  },
  {
    section: "4.2",
    requirement: "e-KTP data review screen",
    criterion: "Tapping the CTA launches the on-demand FR step before any KTP capture screen.",
    status: "implemented",
    where: "pages/app/ReviewEktp.tsx → /app/rekyc/fr",
    route: "/app/rekyc/fr",
  },
  {
    section: "4.2",
    requirement: "e-KTP data review screen",
    criterion:
      "Back or close exits with no session started, no write-back, and no change to verification status or access.",
    status: "implemented",
    where: "state/reducer.ts · abandonSession (the session starts only on the CTA)",
    route: "/app/rekyc/review",
  },
  {
    section: "4.2",
    requirement: "Masking details",
    criterion:
      "NIK, full name, DOB, address, RT/RW, kelurahan and kecamatan masked; occupation, marital status, religion and gender in full.",
    status: "implemented",
    where: "domain/masking.ts",
  },
  {
    section: "4.2",
    requirement: "Report an e-KTP that is not mine",
    criterion:
      "Tapping it starts no session and triggers no FR, capture or Dukcapil call; the help article opens in the in-app browser.",
    status: "implemented",
    where: "pages/app/HelpArticle.tsx",
    route: "/app/rekyc/help/not-mine",
    note: "The 26 Aug meeting notes say to remove this from scope while 4.2 still specifies it — the scenario console toggles it.",
  },
  {
    section: "4.2",
    requirement: "On-demand FR gate before capture",
    criterion: "A live selfie is captured and matched against the on-file face record.",
    status: "simulated",
    where: "pages/app/FaceRecognitionGate.tsx · domain/pipeline.ts frPasses()",
    route: "/app/rekyc/fr",
    note: "No camera or biometric matching — the match score comes from the scenario console.",
  },
  {
    section: "4.2",
    requirement: "On-demand FR gate before capture",
    criterion:
      "A pass proceeds to KTP capture in the same session with no extra confirmation; a failure never reaches capture and leaves the on-file record untouched.",
    status: "implemented",
    where: "pages/app/CaptureKtp.tsx route guard · reducer captureKtp",
  },
  {
    section: "4.2",
    requirement: "KTP and selfie capture flow",
    criterion:
      "The existing OneKYC capture onboarding screen is launched, followed by KTP and selfie capture, with no new screen built.",
    status: "implemented",
    where: "pages/app/CaptureOnboarding.tsx",
    route: "/app/rekyc/onboarding",
  },
  {
    section: "4.2",
    requirement: "KTP and selfie capture flow",
    criterion:
      "An OCR NIK that does not match the on-file NIK is rejected locally with the NIK-mismatch code and no Dukcapil call.",
    status: "implemented",
    where: "domain/pipeline.ts · rekyc_id_mismatch",
  },
  {
    section: "4.2",
    requirement: "KTP and selfie capture flow",
    criterion:
      "OCR confidence below threshold routes to the manual review queue with an explicit pending state rather than a rejection.",
    status: "implemented",
    where: "domain/pipeline.ts · manual_review",
    route: "/app/rekyc/result/pending",
    note: "The PRD lists NIK matching before the confidence gate, so a mismatch rejects even on a low-confidence read. Worth confirming that ordering.",
  },
  {
    section: "4.2",
    requirement: "KTP and selfie capture flow",
    criterion:
      "Name screening and fresh risk scoring run in sequence with no cached result reused from a prior session.",
    status: "implemented",
    where: "domain/pipeline.ts · riskScoringCacheUsed: false",
    note: "The PRD does not say what a screening hit does. Here it routes to manual review rather than auto-rejecting.",
  },
  {
    section: "4.2",
    requirement: "KTP and selfie capture flow",
    criterion: "High risk collects EDD, which must be completed before the session can be approved.",
    status: "implemented",
    where: "pages/app/EddQuestionnaire.tsx · pipeline edd_required",
    route: "/app/rekyc/edd",
  },
  {
    section: "4.2",
    requirement: "KTP and selfie capture flow",
    criterion:
      "Dukcapil cache above the confidence threshold is reused; below it, verification re-runs — verified replaces the data, not verified rejects the attempt.",
    status: "implemented",
    where: "domain/pipeline.ts · dukcapilSource cache|live",
  },
  {
    section: "4.2",
    requirement: "Skip selfie capture",
    criterion: "The selfie captured during FR is reused so the user never takes two selfies.",
    status: "implemented",
    where: "state/reducer.ts · captureKtp (selfieSource fr_reuse)",
  },
  {
    section: "4.2",
    requirement: "Config-driven onboarding copy",
    criterion:
      "Eyebrow, title, body items and primary CTA are resolved from a copy config keyed by the entry context.",
    status: "implemented",
    where: "domain/copy.ts · ONBOARDING_COPY",
    route: "/app/rekyc/onboarding",
  },
  {
    section: "4.2",
    requirement: "NIK-mismatch reject",
    criterion:
      "Reason code rekyc_id_mismatch with the specified EN and ID error copy shown to the user.",
    status: "implemented",
    where: "domain/rejection.ts · REJECTION_COPY",
    route: "/app/rekyc/result/rejected",
  },
  {
    section: "4.2",
    requirement: "ODD interval reset",
    criterion:
      "A successful re-KYC restarts the ODD interval from the newly recalculated risk tier.",
    status: "implemented",
    where: "domain/odd.ts · resetOddInterval, applied inside approveSubmission",
    note: "The cadence per tier (36/24/12 months) is a demo assumption; the PRD only requires the reset.",
  },
  {
    section: "4.2",
    requirement: "Success re-KYC",
    criterion:
      "On completion the user is redirected to the VAC page with a toast saying the KTP has been updated.",
    status: "implemented",
    where: "pages/app/Processing.tsx → /app/vac · components/ui/Toasts.tsx",
    route: "/app/vac",
  },
  {
    section: "4.2.1",
    requirement: "Success notifications",
    criterion:
      "Push notification on Gopay/Gojek/GMA and a dismissible Genie banner on Gopay/GMA, both opening the Verified Account Center.",
    status: "implemented",
    where: "domain/notifications.ts · components/rekyc/GenieBanner.tsx",
    route: "/app/notifications",
  },
  {
    section: "4.3",
    requirement: "One submission per attempt",
    criterion:
      "Every attempt that reaches a decision creates its own submission; existing submission data cannot be edited or deleted.",
    status: "implemented",
    where: "domain/ledger.ts · assertSubmissionDataUnchanged",
  },
  {
    section: "4.3",
    requirement: "One submission per attempt",
    criterion: "An agent changing a decision creates no new submission — only the status changes.",
    status: "implemented",
    where: "domain/ledger.ts · overrideDecision",
    route: "/portal",
  },
  {
    section: "4.3",
    requirement: "One approval at a time",
    criterion:
      "Approving writes the new submission as approved and supersedes the previous one with a system-set superseded_by_newer_approval reason, in one transaction.",
    status: "implemented",
    where: "domain/ledger.ts · approveSubmission",
  },
  {
    section: "4.3",
    requirement: "One approval at a time",
    criterion: "At most one submission per account is approved at any time.",
    status: "implemented",
    where: "domain/ledger.ts · assertAtMostOneApproved",
  },
  {
    section: "4.3",
    requirement: "Rejection semantics",
    criterion:
      "A rejected re-KYC changes nothing else; rejecting the approved submission downgrades the account in the same transaction and promotes nothing.",
    status: "implemented",
    where: "domain/ledger.ts · rejectSubmission",
  },
  {
    section: "4.3",
    requirement: "Rejection semantics",
    criterion: "Approving a submission on a downgraded account restores the KYC status.",
    status: "implemented",
    where: "domain/ledger.ts · approveSubmission",
  },
  {
    section: "4.3",
    requirement: "Eligibility",
    criterion:
      "re-KYC is available only while the account's KYC status is approved; a downgraded customer starts KYC from scratch.",
    status: "implemented",
    where: "domain/ledger.ts · canStartReKyc",
    route: "/app/vac",
  },
  {
    section: "4.3",
    requirement: "Risk score on the submission",
    criterion:
      "The risk score and tier are stored on the submission they came from; the account's tier is read from the approved submission, and no tier is reported when none is approved.",
    status: "implemented",
    where: "domain/ledger.ts · reportedTier",
  },
  {
    section: "4.4",
    requirement: "Reverification submissions in the list",
    criterion:
      "Reverification rows appear alongside initial KYC in chronological order, the type is shown, and the list can be filtered by type.",
    status: "implemented",
    where: "pages/portal/Portal.tsx",
    route: "/portal",
  },
  {
    section: "4.4",
    requirement: "Reverification submissions in the list",
    criterion:
      "A reverification row shows submitted documents, submitted date, status, Level 1, Level 2 and system details.",
    status: "implemented",
    where: "pages/portal/SubmissionDetail.tsx",
    route: "/portal",
  },
  {
    section: "4.4",
    requirement: "Reverification submissions in the list",
    criterion:
      "A system rejection uses a reason code following the same naming convention as current KYC reason codes.",
    status: "implemented",
    where: "domain/types.ts · RejectionReason",
  },
  {
    section: "4.5",
    requirement: "Reverification notification",
    criterion:
      "Every linked partner is notified when a submission becomes approved, carrying only the account identifier, what happened, and the timestamp.",
    status: "implemented",
    where: "domain/ledger.ts · partnerNotifications · domain/partners.ts",
    route: "/partners",
  },
  {
    section: "4.5",
    requirement: "Pull API returns approved data",
    criterion:
      "The on-demand API returns the approved submission's data, or a no-data response when none is approved.",
    status: "implemented",
    where: "domain/partners.ts · pullApprovedData",
    route: "/partners",
  },
  {
    section: "5.1",
    requirement: "Reminder banner (Phase 2)",
    criterion:
      "The banner appears a set number of days before the ODD due date, keeps showing until completion, and its CTA opens the ODD confirmation screen.",
    status: "implemented",
    where: "components/rekyc/OddReminderBanner.tsx · domain/odd.ts",
    route: "/app",
  },
  {
    section: "5.1",
    requirement: "ODD confirmation screen (Phase 2)",
    criterion:
      "Shows NIK, full name, address, occupation and marital status masked, and lets the user confirm the data is unchanged or declare a change.",
    status: "implemented",
    where: "pages/app/OddConfirm.tsx",
    route: "/app/odd/confirm",
  },
  {
    section: "5.1",
    requirement: "Toggleable, phased block enforcement (Phase 2)",
    criterion:
      "Blocking toggles independently of the reminder banner and can be scoped by risk score and days past the due date.",
    status: "implemented",
    where: "domain/odd.ts · evaluateBlock",
    route: "/scenario",
  },
  {
    section: "5.1",
    requirement: "Block overdue accounts (Phase 2)",
    criterion:
      "Blocked users see a screen that stops them doing anything else in the app, while the wallet still works elsewhere.",
    status: "implemented",
    where: "pages/app/Blocked.tsx · pages/app/PhoneLayout.tsx guard",
    route: "/app/blocked",
  },
  {
    section: "4.2",
    requirement: "Manual review queue",
    criterion: "A pending submission is decided by an agent in the E-Money Portal.",
    status: "implemented",
    where: "pages/portal/Portal.tsx",
    route: "/portal",
  },
  {
    section: "4.3.1",
    requirement: "Data model",
    criterion: "Storage rules are enforced in code rather than by a database.",
    status: "backend_only",
    where: "domain/ledger.ts",
    note: "There is no database here. The transactional rules are modelled as pure functions with invariant checks, and the ledger lives in React state.",
  },
];
