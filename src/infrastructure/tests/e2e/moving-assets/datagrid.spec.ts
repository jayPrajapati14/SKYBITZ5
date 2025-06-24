import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/moving-assets");
});

test("should have 8 columns visible by default", async ({ page }) => {
  await expect(page.getByRole("columnheader", { name: "Last Location" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Asset Id" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Device Serial Number" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Start Time" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Duration" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Last Reported" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Asset Type" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
});

test("page size selector should display 25, 50, 100 options", async ({ page }) => {
  await page.getByRole("combobox", { name: "Page size" }).click();
  await expect(page.getByRole("option", { name: "25" })).toBeVisible();
  await expect(page.getByRole("option", { name: "50" })).toBeVisible();
  await expect(page.getByRole("option", { name: "100" })).toBeVisible();
});
