import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "@/app/error";
import { StoryList } from "@/components/StoryList/StoryList";

describe("error state", () => {
  it("shows a Danish message and retries with reset()", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<ErrorPage error={new Error("HN API topstories.json failed")} reset={reset} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Historierne kunne ikke hentes");
    await user.click(screen.getByRole("button", { name: "Prøv igen" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});

describe("empty state", () => {
  it("shows a message instead of an empty list when there are no stories", () => {
    render(<StoryList stories={[]} />);

    expect(screen.getByRole("status")).toHaveTextContent("Ingen historier lige nu");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
