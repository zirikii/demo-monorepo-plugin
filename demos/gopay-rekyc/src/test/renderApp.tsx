import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DemoProvider } from "@/state/DemoProvider";

export function renderWithProviders(ui: ReactElement, initialEntries: string[] = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <DemoProvider>{ui}</DemoProvider>
    </MemoryRouter>,
  );
}
