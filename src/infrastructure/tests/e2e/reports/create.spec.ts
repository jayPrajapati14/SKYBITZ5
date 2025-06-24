import { test, expect, Page } from "@playwright/test";
import {
  FilterConfig,
  AdditionalFilterConfig,
  applyFilters,
  verifyFilterValues,
  verifyFilterVisibility,
} from "../utils/filter";

// Filter config object with placeholders and values
const filterConfig: FilterConfig = {
  landmarkGroup: {
    placeholder: "Type to find a Landmark Group",
    values: ["LM Group 1", "LM Group 2", "LM Group 3"],
  },
  landmarkType: {
    placeholder: "Type to find a Landmark Type",
    values: ["LM Type 1"],
  },
  landmarkName: {
    placeholder: "Type to find a Landmark Name",
    values: ["SkyBitz Distro 1", "SkyBitz Distro 2", "SkyBitz Distro 3"],
  },
  assetType: {
    placeholder: "Type to find an Asset Type",
    values: ["Asset Type 1"],
  },
  // Uncomment when Asset Id bug is fixed
  assetId: {
    placeholder: "Type to find an Asset Id",
    values: ["50000001", "50000002"],
  },
  cargoStatus: {
    placeholder: "Type to find a Cargo Status",
    values: ["Full", "Empty"],
  },
  country: {
    placeholder: "Type to find a Country",
    values: ["United States"],
  },
  state: {
    placeholder: "Type to find a State",
    values: ["Alaska"],
  },
};

// Additional non-autocomplete filters
const additionalFilters: AdditionalFilterConfig = {
  zipCode: {
    placeholder: "Filter by Zip Code",
    value: "11111",
  },
  idleTime: {
    locator: "#idle-time",
    value: "24 hours (1 day)",
  },
  // assetAtLandmarks: {
  //   locator: "#idle-time",
  //   value: "Assets only at landmarks",
  // },
  lastReported: {
    locator: "#idle-time",
    value: "2 weeks (last 14 days)",
  },
};

const REPORT_NAME = "Yard-Check-Report";

test("create and verify report", async ({ page }: { page: Page }) => {
  // Apply filters and create report
  await page.goto("/ng/yard-check");
  await page.getByRole("button", { name: "Filters" }).click();
  await applyFilters(page, filterConfig, additionalFilters);

  await page.locator("#navbar-right-section").getByRole("button", { name: "Reports" }).click();
  await page.getByRole("menuitem", { name: "Create & Schedule Report" }).click();

  await expect(page.locator("#dialog-title")).toHaveText("New Report");
  await expect(page.getByText("Assets: Yard Check")).toBeVisible();

  await page.locator('input[name="reportName"]').fill(REPORT_NAME);
  await page.getByPlaceholder("Add recipients").fill("yardcheck@test.com");
  await page.keyboard.press("Tab");
  await page.getByRole("button", { name: "Create Report" }).click();
  await expect(page.getByText("Report saved successfully!")).toBeVisible();

  // Navigate to reports and view
  await page.locator('button:has-text("Reports")').first().click();
  await expect(page.getByRole("columnheader", { name: "Report Name" })).toBeVisible();

  await page.getByPlaceholder("Find...").fill(REPORT_NAME);
  await expect(page.getByRole("gridcell", { name: REPORT_NAME })).toBeVisible();

  const row = page.getByRole("row").nth(1);
  await row.getByRole("button").click();
  await page.getByRole("menuitem", { name: "View" }).click();
  await page.getByRole("button", { name: "Yes, Proceed", exact: true }).click();

  // Verify filters after redirect
  await page.waitForURL("/ng/yard-check", { timeout: 60000 });
  await page.getByRole("button", { name: "Filters" }).click();
  await verifyFilterVisibility(page, filterConfig, additionalFilters);
  await verifyFilterValues(page, filterConfig, additionalFilters);
});
