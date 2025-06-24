import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/accrued-distance");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("checkbox", { name: "Filter Bar" }).click();
  await page.getByRole("button", { name: "Close" }).click();
});

test("open the filters drawer from the filter bar", async ({ page }) => {
  await page.locator('button:has-text("Filters")').first().click();
  await expect(page.getByRole("heading", { name: "Filters", exact: true })).toBeVisible();
});
