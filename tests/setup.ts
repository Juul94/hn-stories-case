import "@testing-library/jest-dom/vitest";

// `server-only` throws outside a React Server environment. Tests run server code directly.
vi.mock("server-only", () => ({}));
