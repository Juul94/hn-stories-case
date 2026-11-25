import { render, screen } from "@testing-library/react";
import { StoryRow } from "@/components/StoryRow/StoryRow";
import type { Story } from "@/lib/hn/types";

const story: Story = {
  id: 1,
  title: "A story",
  url: "https://example.com/post",
  domain: "example.com",
  time: 1795608000,
  score: 42,
  author: { id: "alice", karma: 1234 },
};

describe("StoryRow", () => {
  it("links the title safely to the story", () => {
    render(<StoryRow story={story} />);
    const link = screen.getByRole("link", { name: /A story/ });
    expect(link).toHaveAttribute("href", "https://example.com/post");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("uses an h3 title under the list's h2 heading", () => {
    render(<StoryRow story={story} />);
    expect(screen.getByRole("heading", { level: 3, name: /A story/ })).toBeInTheDocument();
  });

  it("links the author to their HN profile", () => {
    render(<StoryRow story={story} />);
    const link = screen.getByRole("link", { name: /alice/ });
    expect(link).toHaveAttribute("href", "https://news.ycombinator.com/user?id=alice");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the full URL, time, score and karma with readable labels", () => {
    render(<StoryRow story={story} />);
    expect(screen.getByText("https://example.com/post")).toHaveAttribute(
      "title",
      "https://example.com/post",
    );
    expect(screen.getByText("25. nov. 2026, 13:00").closest("time")).toHaveAttribute(
      "datetime",
      "2026-11-25T12:00:00.000Z",
    );
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("point")).toBeInTheDocument();
    expect(screen.getByText(/1\.234 karma/)).toBeInTheDocument();
  });

  it("shows unknown karma and the HN thread URL for Ask HN", () => {
    const askUrl = "https://news.ycombinator.com/item?id=1";
    render(
      <StoryRow
        story={{ ...story, url: askUrl, domain: null, author: { id: "bob", karma: null } }}
      />,
    );
    expect(screen.getByText(askUrl)).toBeInTheDocument();
    expect(screen.getByText(/karma ukendt/)).toBeInTheDocument();
  });
});
