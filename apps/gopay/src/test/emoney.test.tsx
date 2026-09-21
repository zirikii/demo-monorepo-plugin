import { describe, expect, it } from "vitest";
import { EmoneyPage } from "@/pages/Emoney";
import { AuthProvider } from "@/hooks/useAuth";
import { RekycProvider } from "@/hooks/useRekyc";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("EMoney list", () => {
  it("filters reverification rows", async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <RekycProvider>
          <MemoryRouter>
            <EmoneyPage />
          </MemoryRouter>
        </RekycProvider>
      </AuthProvider>,
    );
    expect(screen.getByRole("button", { name: "Initial KYC" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reverification" }));
    expect(screen.queryByText("sub_sari_initial")).not.toBeInTheDocument();
    expect(screen.getByText("sub_budi_reverify")).toBeInTheDocument();
  });
});
