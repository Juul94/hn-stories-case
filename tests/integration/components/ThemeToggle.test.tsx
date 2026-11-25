import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/TopBar/ThemeToggle";

afterEach(() => {
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});

describe("ThemeToggle", () => {
  it("toggles data-theme, the label and the stored choice", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: "Skift til mørkt tema" });
    expect(button).toHaveAttribute("title", "Skift til mørkt tema");

    await user.click(button);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(button).toHaveAccessibleName("Skift til lyst tema");

    await user.click(button);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(button).toHaveAccessibleName("Skift til mørkt tema");
  });

  it("starts from a theme set before hydration", () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);

    expect(screen.getByRole("button", { name: "Skift til lyst tema" })).toBeInTheDocument();
  });
});
