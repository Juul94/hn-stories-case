import { render, screen } from "@testing-library/react";
import { StoryCard } from "@/components/StoryCard/StoryCard";
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

describe("StoryCard", () => {
  it("links the title safely to the story", () => {
    render(<StoryCard story={story} />);
    const link = screen.getByRole("link", { name: /A story/ });
    expect(link).toHaveAttribute("href", "https://example.com/post");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows domain, time, score, author and karma", () => {
    render(<StoryCard story={story} />);
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(screen.getByText(/25\. nov\. 2026, 13:00/)).toHaveAttribute(
      "datetime",
      "2026-11-25T12:00:00.000Z",
    );
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("alice")).toBeInTheDocument();
    expect(screen.getByText(/1\.234 karma/)).toBeInTheDocument();
  });

  it("shows unknown karma and the HN domain for Ask HN", () => {
    render(<StoryCard story={{ ...story, domain: null, author: { id: "bob", karma: null } }} />);
    expect(screen.getByText("news.ycombinator.com")).toBeInTheDocument();
    expect(screen.getByText(/karma ukendt/)).toBeInTheDocument();
  });
});
