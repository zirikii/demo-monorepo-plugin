import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "@/hooks/useAuth";
import { RekycProvider } from "@/hooks/useRekyc";
import { VacPage } from "@/pages/Vac";
import { DiraPage } from "@/pages/Dira";
import { RekycReviewPage } from "@/pages/RekycReview";
import { encodeSession, decodeSession, loginWithCredentials } from "@/lib/auth";
import { maskName, maskNik } from "@/lib/mask";
import {
  applyDecision,
  evaluateRekyc,
  NIK_MISMATCH,
  overrideSubmissionStatus,
} from "@/lib/rekyc-engine";
import { demoAccount, sariIdentity, updatedIdentity } from "@/data/identity";
import { seedSubmissions } from "@/data/submissions-seed";
import { defaultScenario } from "@/lib/storage";
import { reviewCopy } from "@/data/copy-config";

describe("masking", () => {
  it("masks NIK and name, leaves occupation full", () => {
    expect(maskNik(sariIdentity.nik).includes("3174")).toBe(true);
    expect(maskNik(sariIdentity.nik)).not.toBe(sariIdentity.nik);
    expect(maskName(sariIdentity.fullName).startsWith("Sari")).toBe(true);
    expect(maskName(sariIdentity.fullName)).not.toBe(sariIdentity.fullName);
  });
});

describe("auth", () => {
  it("round-trips and rejects tampered tokens", () => {
    const user = { email: "sari.wulandari@gopay.id", name: "Sari", role: "consumer" as const };
    expect(decodeSession(encodeSession(user))).toEqual(user);
    expect(decodeSession(null)).toBeNull();
    expect(decodeSession("%%%")).toBeNull();
    const logged = loginWithCredentials("agent.kyc@gopay.id", "x");
    expect(logged.role).toBe("agent");
  });
});

describe("rekyc engine", () => {
  const session = {
    id: "s1",
    startedAt: "2026-09-21T00:00:00.000Z",
    frPassedAt: "2026-09-21T00:00:01.000Z",
  };

  it("rejects NIK mismatch without Dukcapil", () => {
    const decision = evaluateRekyc({
      account: demoAccount,
      session,
      scenario: { ...defaultScenario, capturedNik: "111" },
      proposedIdentity: updatedIdentity,
    });
    expect(decision).toEqual({ kind: "nik_mismatch", reason: NIK_MISMATCH.code });
    const applied = applyDecision({
      account: demoAccount,
      submissions: seedSubmissions,
      callbacks: [],
      notifications: [],
      decision,
      proposedIdentity: updatedIdentity,
      scenario: { ...defaultScenario, capturedNik: "111" },
      now: "2026-09-21T00:01:00.000Z",
    });
    expect(applied.account.identityOnFile.nik).toBe(demoAccount.identityOnFile.nik);
    expect(applied.submissions.at(-1)?.reason).toBe("rekyc_id_mismatch");
    expect(applied.callbacks).toHaveLength(0);
  });

  it("fails FR without a submission", () => {
    const decision = evaluateRekyc({
      account: demoAccount,
      session: { id: "s", startedAt: "t" },
      scenario: { ...defaultScenario, frPass: false },
      proposedIdentity: updatedIdentity,
    });
    expect(decision.kind).toBe("fr_failed");
  });

  it("routes low OCR to pending", () => {
    const decision = evaluateRekyc({
      account: demoAccount,
      session,
      scenario: { ...defaultScenario, ocrConfidence: 0.4 },
      proposedIdentity: updatedIdentity,
    });
    expect(decision.kind).toBe("pending_review");
  });

  it("approves and supersedes the previous approved row", () => {
    const decision = evaluateRekyc({
      account: demoAccount,
      session,
      scenario: defaultScenario,
      proposedIdentity: updatedIdentity,
    });
    expect(decision.kind).toBe("approved");
    const applied = applyDecision({
      account: demoAccount,
      submissions: seedSubmissions.filter((s) => s.accountId === demoAccount.id),
      callbacks: [],
      notifications: [],
      decision,
      proposedIdentity: updatedIdentity,
      scenario: defaultScenario,
      now: "2026-09-21T00:02:00.000Z",
    });
    const approved = applied.submissions.filter((s) => s.status === "approved");
    expect(approved).toHaveLength(1);
    expect(applied.submissions.find((s) => s.id === "sub_sari_initial")?.reason).toBe(
      "superseded_by_newer_approval",
    );
    expect(applied.account.identityOnFile.fullName).toBe(updatedIdentity.fullName);
    expect(applied.toast).toContain("diperbarui");
    expect(applied.callbacks.length).toBeGreaterThan(0);
  });

  it("agent override does not create a new submission", () => {
    const next = overrideSubmissionStatus(seedSubmissions, "sub_budi_reverify", "approved");
    expect(next).toHaveLength(seedSubmissions.length);
    expect(next.find((s) => s.id === "sub_budi_reverify")?.status).toBe("approved");
  });
});

function wrap(ui: ReactElement) {
  return (
    <AuthProvider>
      <RekycProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </RekycProvider>
    </AuthProvider>
  );
}

describe("VAC + review", () => {
  it("collapses identity and starts ReKYC from VAC", async () => {
    window.localStorage.setItem(
      "gopay-demo-session",
      encodeSession({ email: "sari.wulandari@gopay.id", name: "Sari", role: "consumer" }),
    );
    const user = userEvent.setup();
    render(wrap(<VacPage />));
    expect(screen.getByText("Identitas terverifikasi")).toBeInTheDocument();
    expect(screen.queryByText("Pekerjaan")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /lihat data lainnya/i }));
    expect(screen.getByText("Pekerjaan")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /perbarui data e-ktp/i })).toBeInTheDocument();
  });

  it("shows a single update CTA on the review screen", () => {
    window.localStorage.setItem(
      "gopay-demo-session",
      encodeSession({ email: "sari.wulandari@gopay.id", name: "Sari", role: "consumer" }),
    );
    render(wrap(<RekycReviewPage />));
    expect(screen.getByText(reviewCopy.explainer)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: reviewCopy.primaryCtaId })).toHaveLength(1);
  });
});

describe("Dira", () => {
  it("routes KTP update questions into ReKYC", async () => {
    window.localStorage.setItem(
      "gopay-demo-session",
      encodeSession({ email: "sari.wulandari@gopay.id", name: "Sari", role: "consumer" }),
    );
    const user = userEvent.setup();
    render(wrap(<DiraPage />));
    await user.type(screen.getByLabelText("Pesan ke Dira"), "mau perbarui KTP");
    await user.click(screen.getByRole("button", { name: "Kirim" }));
    expect(await screen.findByRole("button", { name: "Mulai ReKYC" })).toBeInTheDocument();
  });
});
