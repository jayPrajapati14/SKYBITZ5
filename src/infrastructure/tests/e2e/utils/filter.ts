import { expect, Page } from "@playwright/test";

export interface AdditionalFilterConfig {
  [key: string]: {
    [key: string]: string;
    value: string;
  };
}

export interface FilterConfig {
  [key: string]: {
    placeholder: string;
    values: string[];
  };
}

export async function selectOptions(page: Page, placeholder: string, options: string[]): Promise<void> {
  const input = page.getByPlaceholder(placeholder);
  await input.click();
  for (const option of options) {
    await page.getByRole("option", { name: option, exact: true }).getByRole("checkbox").click();
  }
}

export async function verifyAutocomplete(page: Page, placeholder: string, options: string[]): Promise<void> {
  const input = page.getByPlaceholder(placeholder);
  const inputRoot = input.locator('xpath=ancestor::*[contains(@class, "MuiInputBase-root")]');
  for (const option of options) {
    const chipLocator = inputRoot.locator(`.MuiChip-root .MuiChip-label:text("${option}")`);
    await expect(chipLocator, `Chip "${option}" should be visible for ${placeholder}`).toBeVisible();
  }

  await input.click();
  for (const option of options) {
    await expect(
      page.getByRole("option", { name: option, exact: true }).getByRole("checkbox"),
      `Option "${option}" should be checked in dropdown for ${placeholder}`
    ).toBeChecked();
  }
  await page.keyboard.press("Escape");
}

export async function applyFilters(
  page: Page,
  filterConfig: FilterConfig,
  additionalFilters: AdditionalFilterConfig
): Promise<void> {
  await selectOptions(page, filterConfig.landmarkGroup.placeholder, filterConfig.landmarkGroup.values);
  await selectOptions(page, filterConfig.landmarkType.placeholder, filterConfig.landmarkType.values);

  const landmarkName = page.getByPlaceholder(filterConfig.landmarkName.placeholder);
  await landmarkName.click();
  await landmarkName.fill("SkyBitz Distro");
  await selectOptions(page, filterConfig.landmarkName.placeholder, filterConfig.landmarkName.values);
  await selectOptions(page, filterConfig.assetType.placeholder, filterConfig.assetType.values);
  await selectOptions(page, filterConfig.cargoStatus.placeholder, filterConfig.cargoStatus.values);
  if (filterConfig.volumetricStatus) {
    await selectOptions(page, filterConfig.volumetricStatus.placeholder, filterConfig.volumetricStatus.values);
  }
  if (filterConfig.motionStatus) {
    await selectOptions(page, filterConfig.motionStatus.placeholder, filterConfig.motionStatus.values);
  }
  const assetIds = page.getByPlaceholder(filterConfig.assetId.placeholder).nth(0);
  await assetIds.click();
  await assetIds.fill("5000000");
  await selectOptions(page, filterConfig.assetId.placeholder, filterConfig.assetId.values);

  await selectOptions(page, filterConfig.country.placeholder, filterConfig.country.values);
  await selectOptions(page, filterConfig.state.placeholder, filterConfig.state.values);

  if (additionalFilters.zipCode) {
    const zipCode = page.getByPlaceholder(additionalFilters.zipCode.placeholder);
    await zipCode.click();
    await zipCode.fill(additionalFilters.zipCode.value);
  }

  if (additionalFilters.textSearch) {
    const search = page.locator(additionalFilters.textSearch.locator);
    await search.click();
    await search.fill(additionalFilters.textSearch.value);
  }

  if (additionalFilters.idleTime) {
    await page
      .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Idle Time" }) })
      .locator(".MuiSelect-select")
      .click();
    await page.locator("li", { hasText: additionalFilters.idleTime.value }).click();
  }

  if (additionalFilters.lastReported) {
    await page
      .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Last Reported" }) })
      .locator(".MuiSelect-select")
      .click();
    await page.locator("li", { hasText: additionalFilters.lastReported.value }).click();
  }

  if (additionalFilters.assetAtLandmarks) {
    await page
      .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Assets at landmarks" }) })
      .locator(".MuiSelect-select")
      .click();
    await page.locator("li", { hasText: additionalFilters.assetAtLandmarks.value }).click();
  }

  await page.keyboard.press("Escape");
}

export async function verifyFilterVisibility(
  page: Page,
  filterConfig: FilterConfig,
  additionalFilters: AdditionalFilterConfig
): Promise<void> {
  for (const filter of Object.values(filterConfig)) {
    await expect(page.getByPlaceholder(filter.placeholder), `${filter.placeholder} should be visible`).toBeVisible();
  }

  if (additionalFilters.textSearch) {
    await expect(page.locator(additionalFilters.textSearch.locator), "Asset Search should be visible").toBeVisible();
  }

  if (additionalFilters.zipCode) {
    await expect(
      page.getByPlaceholder(additionalFilters.zipCode.placeholder),
      "Zip Code filter should be visible"
    ).toBeVisible();
  }

  if (additionalFilters.idleTime) {
    await expect(
      page
        .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Idle Time" }) })
        .locator(".MuiSelect-select"),
      "Idle Time filter should be visible"
    ).toBeVisible();
  }

  if (additionalFilters.lastReported) {
    await expect(
      page
        .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Last Reported" }) })
        .locator(".MuiSelect-select"),
      "Last reported filter should be visible"
    ).toBeVisible();
  }

  if (additionalFilters.assetAtLandmarks) {
    await expect(
      page
        .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Assets at landmarks" }) })
        .locator(".MuiSelect-select"),
      "Asset at landmark filter should be visible"
    ).toBeVisible();
  }
}

export async function verifyFilterValues(
  page: Page,
  filterConfig: FilterConfig,
  additionalFilters: AdditionalFilterConfig
): Promise<void> {
  // Verify Autocomplete filter values
  for (const filter of Object.values(filterConfig)) {
    await verifyAutocomplete(page, filter.placeholder, filter.values);
  }

  // Verify additional filter values
  if (additionalFilters.zipCode) {
    await expect(page.getByPlaceholder(additionalFilters.zipCode.placeholder)).toHaveValue(
      additionalFilters.zipCode.value
    );
  }

  if (additionalFilters.textSearch) {
    await expect(page.locator(additionalFilters.textSearch.locator)).toHaveValue(additionalFilters.textSearch.value);
  }

  if (additionalFilters.idleTime) {
    await expect(
      page
        .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Idle Time" }) })
        .locator(".MuiSelect-select")
    ).toHaveText(additionalFilters.idleTime.value);
  }

  if (additionalFilters.lastReported) {
    await expect(
      page
        .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Last Reported" }) })
        .locator(".MuiSelect-select")
    ).toHaveText(additionalFilters.lastReported.value);
  }

  if (additionalFilters.assetAtLandmarks) {
    await expect(
      page
        .locator(".MuiFormControl-root", { has: page.locator("label", { hasText: "Assets at landmarks" }) })
        .locator(".MuiSelect-select")
    ).toHaveText(additionalFilters.assetAtLandmarks.value);
  }
}
