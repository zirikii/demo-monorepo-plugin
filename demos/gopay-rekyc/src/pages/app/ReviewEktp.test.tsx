import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ON_FILE_IDENTITY } from "@/data/identity";
import { REVIEW_COLLAPSED_FIELDS, REVIEW_EXPANDED_FIELDS } from "@/data/fields";
import { renderWithProviders } from "@/test/renderApp";
import { ReviewEktp } from "./ReviewEktp";

function renderScreen() {
  return renderWithProviders(<ReviewEktp />, ["/app/rekyc/review"]);
}

describe("e-KTP data review screen", () => {
  it("explains that this is the data on file before anything is captured", () => {
    renderScreen();
    expect(screen.getByTestId("review-explainer")).toHaveTextContent(/e-KTP/i);
  });

  it("opens collapsed on the six fields the PRD lists", () => {
    renderScreen();

    for (const field of REVIEW_COLLAPSED_FIELDS) {
      expect(screen.getByTestId(`identity-field-${field}`)).toBeInTheDocument();
    }
    for (const field of REVIEW_EXPANDED_FIELDS) {
      expect(screen.queryByTestId(`identity-field-${field}`)).not.toBeInTheDocument();
    }
  });

  it("reveals the rest, still masked, and flips the control label", async () => {
    const user = userEvent.setup();
    renderScreen();

    const control = screen.getByTestId("review-expand");
    expect(control).toHaveAttribute("aria-expanded", "false");
    expect(control).toHaveTextContent("Lihat data lain");

    await user.click(control);

    expect(control).toHaveAttribute("aria-expanded", "true");
    expect(control).toHaveTextContent("Sembunyikan data");
    for (const field of REVIEW_EXPANDED_FIELDS) {
      expect(screen.getByTestId(`identity-field-${field}`)).toBeInTheDocument();
    }

    const kelurahan = screen.getByTestId("identity-field-kelurahan");
    expect(within(kelurahan).queryByText(ON_FILE_IDENTITY.kelurahan)).not.toBeInTheDocument();
  });

  it("masks the NIK, name and address but not occupation or marital status", async () => {
    const user = userEvent.setup();
    renderScreen();
    await user.click(screen.getByTestId("review-expand"));

    expect(screen.queryByText(ON_FILE_IDENTITY.nik)).not.toBeInTheDocument();
    expect(screen.queryByText(ON_FILE_IDENTITY.fullName)).not.toBeInTheDocument();
    expect(screen.queryByText(ON_FILE_IDENTITY.address)).not.toBeInTheDocument();

    expect(
      within(screen.getByTestId("identity-field-occupation")).getByText(
        ON_FILE_IDENTITY.occupation,
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("identity-field-maritalStatus")).getByText(
        ON_FILE_IDENTITY.maritalStatus,
      ),
    ).toBeInTheDocument();
    expect(
      within(screen.getByTestId("identity-field-religion")).getByText(ON_FILE_IDENTITY.religion),
    ).toBeInTheDocument();
  });

  it("renders one primary CTA in both the collapsed and expanded state", async () => {
    const user = userEvent.setup();
    renderScreen();

    expect(screen.getAllByTestId("review-cta")).toHaveLength(1);
    await user.click(screen.getByTestId("review-expand"));
    expect(screen.getAllByTestId("review-cta")).toHaveLength(1);
    expect(screen.getByTestId("review-cta")).toHaveTextContent(
      "Data e-KTP saya perlu diperbarui",
    );
  });

  it("offers the not-mine report as a secondary link, not a second CTA", () => {
    renderScreen();
    const notMine = screen.getByTestId("review-not-mine");
    expect(notMine).toHaveTextContent("e-KTP ini bukan milik saya");
    expect(notMine).not.toBe(screen.getByTestId("review-cta"));
  });
});
