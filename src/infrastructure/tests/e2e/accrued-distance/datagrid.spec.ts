import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/accrued-distance");
});
test("should display datagrid", async ({ page }) => {
  await expect(page.getByText("RESULTS")).toBeVisible();
});

test("should have 6 columns visible by default", async ({ page }) => {
  await expect(page.getByRole("columnheader", { name: "Asset Id" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Accrued Distance (miles)" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Asset Type" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Device Serial Number" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Device Install Date" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Last Reported" })).toBeVisible();
});

test("page size selector should display 25, 50, 100 options", async ({ page }) => {
  await page.getByRole("combobox", { name: "Page size" }).click();
  await expect(page.getByRole("option", { name: "25" })).toBeVisible();
  await expect(page.getByRole("option", { name: "50" })).toBeVisible();
  await expect(page.getByRole("option", { name: "100" })).toBeVisible();
});
