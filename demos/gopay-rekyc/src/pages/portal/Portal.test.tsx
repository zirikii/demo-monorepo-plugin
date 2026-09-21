import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderApp";
import { Portal } from "./Portal";

describe("E-Money Portal", () => {
  it("lists the account's submissions with their type", () => {
    renderWithProviders(<Portal />, ["/portal"]);

    expect(screen.getByTestId("submission-row-sub_initial_kyc")).toHaveTextContent("initial KYC");
  });

  it("filters the list by submission type", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portal />, ["/portal"]);

    await user.click(screen.getByRole("button", { name: "Reverification" }));
    expect(screen.queryByTestId("submission-row-sub_initial_kyc")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Initial KYC" }));
    expect(screen.getByTestId("submission-row-sub_initial_kyc")).toBeInTheDocument();
  });

  it("shows documents, level details and system details for the selected row", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portal />, ["/portal"]);

    await user.click(screen.getByTestId("submission-row-sub_initial_kyc"));

    expect(screen.getByText("Submitted documents")).toBeInTheDocument();
    expect(screen.getByText("Level 1 details")).toBeInTheDocument();
    expect(screen.getByText("Level 2 details")).toBeInTheDocument();
    expect(screen.getByText("System details")).toBeInTheDocument();
  });

  it("downgrades the account when an agent rejects the approved submission", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Portal />, ["/portal"]);

    await user.click(screen.getByTestId("submission-row-sub_initial_kyc"));
    await user.click(screen.getByRole("button", { name: "Reject" }));

    expect(screen.getByText(/KYC status/)).toHaveTextContent("downgraded");
  });
});
