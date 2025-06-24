import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/yard-check-2");
  const rightSection = page.locator("#navbar-right-section");
  await rightSection.getByRole("button", { name: "Reports" }).click();
});

test("reports menu is visible", async ({ page }) => {
  await expect(page.getByRole("menuitem", { name: "Download CSV Report" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Create & Schedule Report" })).toBeVisible();
});

test("download csv report", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("menuitem", { name: "Download CSV Report" }).click();
  const download = await downloadPromise;
  await download.saveAs(download.suggestedFilename());
});

test("create and schedule report creates a report for the current 'Yard Check' view", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await expect(page.locator("#dialog-title")).toHaveText("New Report");
  await expect(page.getByText("Assets: Yard Check")).toBeVisible();
});

test("close the report modal", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator("#dialog-title")).not.toBeVisible();
});

test("do not repeat schedule", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByRole("checkbox").click();
  await expect(page.getByText("Runs Does not repeat")).toBeVisible();
  await expect(page.getByText("Once")).toBeVisible();
});

test("repeat schedule", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByRole("checkbox").click({ clickCount: 2 });
  await expect(page.getByText("Runs Daily")).toBeVisible();
  await expect(page.getByText("day(s)")).toBeVisible();
});

test("weekly schedule", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByLabel("Unit").click();
  await page.getByRole("option", { name: "week(s)" }).click();
  await expect(page.getByText("Runs weekly on Monday")).toBeVisible();
});

test("weekly schedule starts on sunday", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByLabel("Unit").click();
  await page.getByRole("option", { name: "week(s)" }).click();
  await expect(page.getByText(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].join(""))).toBeVisible();
});

test("monthly schedule", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByLabel("Unit").click();
  await page.getByRole("option", { name: "month(s)" }).click();
  await expect(page.getByText("Runs monthly on the first Monday")).toBeVisible();
});

test("yearly schedule", async ({ page }) => {
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();
  await page.getByLabel("Unit").click();
  await page.getByRole("option", { name: "year(s)" }).click();
  await expect(page.getByText("Runs annually on the first Monday of January")).toBeVisible();
});
