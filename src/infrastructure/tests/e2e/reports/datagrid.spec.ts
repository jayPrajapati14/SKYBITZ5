import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/reports");
});

test("should have 6 columns visible by default", async ({ page }) => {
  await expect(page.getByRole("columnheader", { name: "Report Name" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Based on view" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Created At" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Schedule" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Recipients" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Last Run" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Next Run" })).toBeVisible();
});

test("page size selector should display 25, 50, 100 options", async ({ page }) => {
  await page.getByRole("combobox", { name: "Page size" }).click();
  await expect(page.getByRole("option", { name: "25" })).toBeVisible();
  await expect(page.getByRole("option", { name: "50" })).toBeVisible();
  await expect(page.getByRole("option", { name: "100" })).toBeVisible();
});
