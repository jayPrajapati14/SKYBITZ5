import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/yard-check-2");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("checkbox", { name: "Filter Bar" }).click();
  await page.getByRole("button", { name: "Close" }).click();
});

test("filter bar is visible", async ({ page }) => {
  await expect(page.getByText("2 filters are currently applied.")).toBeVisible();
});

test("open the filters drawer from the filter bar", async ({ page }) => {
  await page.locator('button:has-text("Filters")').first().click();
  await expect(page.getByRole("heading", { name: "Yard Check Filters", exact: true })).toBeVisible();
});
