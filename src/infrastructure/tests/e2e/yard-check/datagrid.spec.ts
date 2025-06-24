import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/yard-check");
});

test("should display datagrid", async ({ page }) => {
  await expect(
    page.getByText(
      "Start by applying at least one of these filters to see results: \n Landmark Group, Landmark Names, Asset IDs"
    )
  ).toBeVisible();
});

test("should have 5 columns visible by default", async ({ page }) => {
  await expect(page.getByRole("columnheader", { name: "Landmark" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Asset Id" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Last Reported" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Idle Time" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Status" })).toBeVisible();
});

test("page size selector should display 25, 50, 100 options", async ({ page }) => {
  await page.getByRole("combobox", { name: "Page size" }).click();
  await expect(page.getByRole("option", { name: "25" })).toBeVisible();
  await expect(page.getByRole("option", { name: "50" })).toBeVisible();
  await expect(page.getByRole("option", { name: "100" })).toBeVisible();
});
