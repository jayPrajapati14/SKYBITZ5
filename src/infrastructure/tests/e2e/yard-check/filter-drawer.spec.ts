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
  lastReported: {
    locator: "#idle-time",
    value: "2 weeks (last 14 days)",
  },
};

test.beforeEach(async ({ page }) => {
  await page.goto("/ng/yard-check");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("checkbox", { name: "Filter Bar" }).click();
});

test("close the filters drawer", async ({ page }) => {
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Filters2", { exact: true })).not.toBeVisible();
});

test("filters sections are visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Landmark Filters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Asset Filters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Location Filters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sensor Filters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Operational Filters" })).toBeVisible();
});

test("pin and unpin multiple filters", async ({ page }) => {
  // Pin the first 3 filters
  for (let i = 0; i < 12; i++) {
    await page.getByRole("button", { name: "Pinned to Filters Bar" }).nth(i).click();
  }
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("button", { name: "Landmark Group" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Landmark Type" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Landmark Name" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Asset Type" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Asset Id" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Country" })).toBeVisible();
  await expect(page.getByRole("button", { name: "State" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zip Code" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Cargo Status" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Only assets at landmarks" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Idle Time" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Last week" })).toBeVisible();
  // Unpin the filter
  await page.getByRole("button", { name: "Filters" }).first().click();
  for (let i = 0; i < 12; i++) {
    await page.getByRole("button", { name: "Pinned to Filters Bar" }).nth(i).click();
  }
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("button", { name: "Landmark Group" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Landmark Type" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Landmark Name" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Asset Type" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Asset Id" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Country" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "State" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Zip Code" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Cargo Status" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Only assets at landmarks" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Idle Time" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Last week" })).not.toBeVisible();
});

test("landmark group selector can select multiple groups", async ({ page }) => {
  const selector = page.getByPlaceholder("Type to find a Landmark Group");
  await selector.click();
  await page.getByRole("option", { name: "LM Group 1", exact: true }).getByRole("checkbox").click();
  await page.getByRole("option", { name: "LM Group 2", exact: true }).getByRole("checkbox").click();
  await page.getByRole("option", { name: "LM Group 3", exact: true }).getByRole("checkbox").click();
  await page.keyboard.press("Escape");

  await expect(page.getByText("Filters3")).toBeVisible();
});

test("asset at landmarks filter is selected by default", async ({ page }) => {
  await expect(page.getByText("Assets only at landmarks")).toBeVisible();
});

test("last reported filter is selected by default", async ({ page }) => {
  await expect(page.getByText("1 week")).toBeVisible();
});

test("clear all filters button should clear all filters except default filters", async ({ page }) => {
  const selector = page.getByPlaceholder("Type to find a Landmark Group");
  await selector.click();
  await page.getByRole("option", { name: "LM Group 1", exact: true }).getByRole("checkbox").click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Clear All" }).click();
  await expect(page.getByText("Operational Filters2")).toBeVisible();
});

test("apply filters", async ({ page }) => {
  await applyFilters(page, filterConfig, additionalFilters);
  await page.reload();
  await page.getByRole("button", { name: "Filters" }).click();
  await verifyFilterVisibility(page, filterConfig, additionalFilters);
  await verifyFilterValues(page, filterConfig, additionalFilters);
});
