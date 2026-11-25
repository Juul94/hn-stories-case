import { expect, test, type Page } from "@playwright/test";

const stories = (page: Page) => page.getByRole("article");
const titles = (page: Page) => page.getByRole("heading", { level: 3 }).allTextContents();

/** The bold score number in each row. */
async function scores(page: Page): Promise<number[]> {
  const values = await stories(page).locator("span").filter({ hasText: /^\d+$/ }).allTextContents();
  return values.map(Number);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("shows 10 stories sorted by score, lowest first", async ({ page }) => {
  await expect(stories(page)).toHaveCount(10);

  const values = await scores(page);
  expect(values).toHaveLength(10);
  expect(values).toEqual([...values].sort((a, b) => a - b));
});

test("shows all required fields and the dummy image for each story", async ({ page }) => {
  for (const story of await stories(page).all()) {
    await expect(story.getByRole("heading", { level: 3 })).toBeVisible();
    await expect(story.getByText(/^https:\/\//)).toBeVisible();
    await expect(story.locator("time")).toBeVisible();
    await expect(story.locator("span").filter({ hasText: /^\d+$/ })).toBeVisible();
    await expect(story.getByRole("link", { name: /^user\d+/ })).toBeVisible();
    await expect(story.getByText(/[\d.]+ karma/)).toBeVisible();
    await expect(story.locator('img[src="/placeholder.svg"]')).toBeVisible();
  }
});

test('"Vis 10 nye historier" loads a new set', async ({ page }) => {
  const before = await titles(page);

  await page.getByRole("button", { name: "Vis 10 nye historier" }).click();

  await expect.poll(() => titles(page)).not.toEqual(before);
  await expect(stories(page)).toHaveCount(10);
});

test("changing the sort reorders the same 10 stories", async ({ page }) => {
  await page.goto("/?seed=e2e");
  await expect(stories(page)).toHaveCount(10);
  const before = await titles(page);

  await page.getByLabel("Sortér efter").selectOption("score-desc");

  await expect(page).toHaveURL(/[?&]seed=e2e&sort=score-desc/);
  await expect.poll(() => titles(page)).not.toEqual(before);
  expect([...(await titles(page))].sort()).toEqual([...before].sort());
  const values = await scores(page);
  expect(values).toEqual([...values].sort((a, b) => b - a));
});

test("keeps the chosen theme after a reload", async ({ page }) => {
  const html = page.locator("html");

  await page.getByRole("button", { name: "Skift til mørkt tema" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Skift til lyst tema" })).toBeVisible();
});

test("has no horizontal scroll at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(stories(page)).toHaveCount(10);

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});
