import { test, expect, Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("navigate to Yard Check page", async ({ page }) => {
  await expect(page).toHaveURL("/ng/yard-check");
  await isTabActive(page, "Yard Check");
});

test("navigate to Accrued Distance page", async ({ page }) => {
  await page.getByRole("link", { name: "Accrued Distance" }).click();
  await expect(page).toHaveURL("/ng/accrued-distance");
  await isTabActive(page, "Accrued Distance");
});

test("navigate to Reports page", async ({ page }) => {
  await page.getByRole("link", { name: "Reports" }).click();
  await expect(page).toHaveURL("/ng/reports");
  await isTabActive(page, "Reports");
});

const isTabActive = async (page: Page, buttonText: string) => {
  const button = page.getByRole("button", { name: buttonText });
  await expect(button).toBeVisible();
  await expect(button).toHaveClass(/MuiButton-contained MuiButton-containedPrimary/);
};
