import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RefreshButton } from "@/components/TopBar/RefreshButton";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  isPending: false,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace }),
}));

// Controls the pending state, since a mocked navigation resolves instantly.
vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  return {
    ...react,
    useTransition: () => [mocks.isPending, (callback: () => void) => callback()],
  };
});

beforeEach(() => {
  mocks.replace.mockClear();
  mocks.isPending = false;
});

describe("RefreshButton", () => {
  it("loads a new seed in the default sort on click", async () => {
    const user = userEvent.setup();
    render(<RefreshButton />);

    await user.click(screen.getByRole("button", { name: "Vis 10 nye historier" }));
    expect(mocks.replace).toHaveBeenCalledTimes(1);
    expect(mocks.replace).toHaveBeenCalledWith(expect.stringMatching(/^\/\?seed=[a-z0-9]{6}$/));
  });

  it("shows the loading label and ignores clicks while pending", async () => {
    mocks.isPending = true;
    const user = userEvent.setup();
    render(<RefreshButton />);

    const button = screen.getByRole("button", { name: "Henter…" });
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Henter…")).toBeVisible();

    await user.click(button);
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  // A natively disabled button drops keyboard focus in browsers.
  it("stays focusable while pending", () => {
    mocks.isPending = true;
    render(<RefreshButton />);

    const button = screen.getByRole("button", { name: "Henter…" });
    expect(button).not.toBeDisabled();
    button.focus();
    expect(button).toHaveFocus();
  });
});
