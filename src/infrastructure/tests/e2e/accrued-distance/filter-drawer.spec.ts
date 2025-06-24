import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/accrued-distance");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("checkbox", { name: "Filter Bar" }).click();
});

test("close the filters drawer", async ({ page }) => {
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Filters2", { exact: true })).not.toBeVisible();
});

test("filters sections are visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Asset Filters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Operational Filters" })).toBeVisible();
});

test("pin and unpin multiple filters", async ({ page }) => {
  // Pin the first 3 filters
  const startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  const endDate = new Date();
  const dateRangeLable = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "Pinned to Filters Bar" }).nth(i).click();
  }
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("button", { name: "Asset Id" })).toBeVisible();
  await expect(page.getByRole("button", { name: dateRangeLable })).toBeVisible();

  // Unpin the filter
  await page.getByRole("button", { name: "Filters" }).first().click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole("button", { name: "Pinned to Filters Bar" }).nth(i).click();
  }
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("button", { name: "Asset Id" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: dateRangeLable })).not.toBeVisible();
});

test("Asset Id's selector can select multiple assets", async ({ page }) => {
  const selector = page.getByPlaceholder("Type to find an Asset Id");
  await selector.click();

  selector.fill("5000000");
  await page.getByRole("option", { name: "50000001", exact: true }).getByRole("checkbox").click();
  await page.getByRole("option", { name: "50000002", exact: true }).getByRole("checkbox").click();
  await page.getByRole("option", { name: "50000003", exact: true }).getByRole("checkbox").click();
  await page.keyboard.press("Escape");

  await expect(page.getByText("Filters2")).toBeVisible();
});

test("Trip completed within date range is selected by default", async ({ page }) => {
  const startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  const endDate = new Date();
  const dateRange = `${startDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} — ${endDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}`;

  const selector = page.getByPlaceholder("Select a date range");
  await expect(selector).toHaveValue(dateRange);
});

test("open calender", async ({ page }) => {
  const selector = page.getByPlaceholder("Select a date range");
  await selector.click();
  await expect(page.getByText("Last Week")).toBeVisible();
  await expect(page.getByText("Last 7 Days")).toBeVisible();
  await expect(page.getByText("OK")).toBeVisible();
  await expect(page.getByText("Last Month")).toBeVisible();
});

test("clear all filters button should clear all filters except default filters", async ({ page }) => {
  const selector = page.getByPlaceholder("Type to find an Asset Id");
  await selector.click();
  selector.fill("5000000");
  await page.getByRole("option", { name: "50000001", exact: true }).getByRole("checkbox").click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clear All" }).click();
  await expect(page.getByText("1 filter is currently applied.")).toBeVisible();
});
