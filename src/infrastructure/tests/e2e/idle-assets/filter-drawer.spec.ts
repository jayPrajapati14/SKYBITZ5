import { test, expect } from "@playwright/test";
import {
  FilterConfig,
  AdditionalFilterConfig,
  applyFilters,
  verifyFilterValues,
  verifyFilterVisibility,
} from "../utils/filter";

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
    values: ["Loaded", "Empty"],
  },
  volumetricStatus: {
    placeholder: "Type to find a Volumetric Cargo Status...",
    values: ["Loaded", "Empty"],
  },
  motionStatus: {
    placeholder: "Type to find a Motion Status",
    values: ["Closed", "Moving"],
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
  assetAtLandmarks: {
    locator: "#idle-time",
    value: "Assets only at landmarks",
  },
  lastReported: {
    locator: "#idle-time",
    value: "2 weeks (last 14 days)",
  },
  textSearch: {
    locator: ".MuiDrawer-paper input[placeholder='Search Assets']",
    value: "1000",
  },
};

const FILTER_SECTIONS = ["Asset Filters", "Location Filters", "Sensor Filters", "Operational Filters"];

const FILTER_PANEL = [
  "Filter By Text Search",
  "Landmark Group",
  "Landmark Type",
  "Landmark Name",
  "Asset Type",
  "Asset Ids",
  "Country",
  "State",
  "US Zip Code",
  "Cargo Status",
  "Volumetric Cargo Status (SkyCamera)",
  "Motion Status",
  "Assets at landmarks",
  "Idle Time",
  "Last Reported",
];

const FILTER_BAR = [
  "Landmark Group",
  "Landmark Type",
  "Landmark Name",
  "Asset Type",
  "Asset Id",
  "Country",
  "State",
  "Zip Code",
  "Cargo Status",
  "Volumetric Cargo Status",
  "1 Motion Status",
  "No idle time",
  "Last 28 days",
];

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/idle-assets");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("checkbox", { name: "Filter Bar" }).click();
});

test("close the filters drawer", async ({ page }) => {
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Filters2", { exact: true })).not.toBeVisible();
});

test("filters sections are visible", async ({ page }) => {
  for (let i = 0; i < FILTER_SECTIONS.length; i++) {
    await expect(page.getByText(FILTER_SECTIONS[i], { exact: true })).toBeVisible();
  }
});

test("filters are visible", async ({ page }) => {
  const rightSection = page.locator(".MuiDrawer-paper");
  for (let i = 0; i < FILTER_PANEL.length; i++) {
    await expect(rightSection.getByText(FILTER_PANEL[i], { exact: true })).toBeVisible();
  }
});

test("pin and unpin multiple filters", async ({ page }) => {
  // Pin the filters
  for (let i = 0; i < 15; i++) {
    await page.getByRole("button", { name: "Pinned to Filters Bar" }).nth(i).click();
  }
  await page.getByRole("button", { name: "Close" }).click();
  for (let i = 0; i < FILTER_BAR.length; i++) {
    await expect(page.getByRole("button", { name: FILTER_BAR[i], exact: true })).toBeVisible();
  }
  // Unpin the filter
  await page.getByRole("button", { name: "Filters" }).first().click();
  for (let i = 0; i < 15; i++) {
    await page.getByRole("button", { name: "Pinned to Filters Bar" }).nth(i).click();
  }
  await page.getByRole("button", { name: "Close" }).click();
  for (let i = 0; i < FILTER_BAR.length; i++) {
    await expect(page.getByRole("button", { name: FILTER_BAR[i], exact: true })).not.toBeVisible();
  }
});

test("default filters are selected", async ({ page }) => {
  // Idle motion status should be disabled
  const selector = page.getByPlaceholder(filterConfig.motionStatus.placeholder);
  await selector.click();
  await expect(page.getByRole("option", { name: "Idle", exact: true }).getByRole("checkbox")).toBeDisabled();
  await expect(page.getByText("Assets anywhere")).toBeVisible();
  await expect(page.getByText("4 week")).toBeVisible();
});

test("clear all filters button should clear all filters except default filters", async ({ page }) => {
  const selector = page.getByPlaceholder("Type to find a Landmark Group");
  await selector.click();
  await page.getByRole("option", { name: "LM Group 1", exact: true }).getByRole("checkbox").click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clear All" }).click();
  await expect(page.getByText("Operational Filters2")).toBeVisible();
});

test("apply and check filters", async ({ page }) => {
  await expect(page.getByText("Idle Assets Filters")).toBeVisible();
  await applyFilters(page, filterConfig, additionalFilters);
  await page.reload();
  await page.getByRole("button", { name: "Filters" }).click();
  await expect(page.getByText("Idle Assets Filters")).toBeVisible();
  await verifyFilterVisibility(page, filterConfig, additionalFilters);
  await verifyFilterValues(page, filterConfig, additionalFilters);
});
