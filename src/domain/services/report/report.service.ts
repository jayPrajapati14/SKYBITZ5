import { ReportRepository } from "@/infrastructure/repositories";
import { ReportTypes } from "../../models/report";
import { arrayFilterCount, objectFilterCount, scalarFilterCount } from "../../utils/filter-counts";
import { getAssetTypes } from "../asset/asset.service";
import { getLandmarkGroups, getLandmarkTypes, getLandmarksByIds } from "../landmark/landmark.service";
import { getCountries } from "../location/location.service";
import { Metadata } from "@/domain/models/metadata";
import { getAssetsByIds } from "@/domain/services/asset/asset.service";

/**
 * Sort by field for reports
 * @type {keyof ReportFile}
 */
type ReportSortByFied = keyof ReportFile;

/**
 * Sort by for reports
 */
export type ReportSortBy = {
  field: ReportSortByFied;
  sort: SortDirection;
};

/**
 * Parameters for getting reports
 */
export type GetReportParams = {
  name?: string;
  limit?: number;
  offset?: number;
  sortBy?: ReportSortBy;
};

/**
 * Get reports
 * @param options - Parameters for getting reports
 * @returns The reports paginated response with the reports and total count
 */
export function getReports(options: GetReportParams, metadata?: Metadata): PaginatedResponse<ReportFile, "reports"> {
  return ReportRepository.getReports(options, metadata);
}

/**
 * Parameters for creating a report
 */
export type CreateReportParams = {
  name: string;
  type: ReportFile["type"];
  recurrence: Recurrence;
  recipients: string[];
  filters:
    | { type: Extract<ReportViewType, "YARD_CHECK">; values: YardCheckFilters }
    | { type: Extract<ReportViewType, "ACCRUED_DISTANCE">; values: AccruedDistanceFilters };
};

/**
 * Create a report
 * @param options - Parameters for creating a report
 * @returns The created report
 */
export function createReport(options: CreateReportParams): Promise<ReportFile> {
  return ReportRepository.createReport(options);
}

/**
 * Parameters for updating a report
 */
export type UpdateReportParams = CreateReportParams & {
  id: string;
};

/**
 * Update a report
 * @param options - Parameters for updating a report
 * @returns The updated report
 */
export function updateReport(options: UpdateReportParams): Promise<ReportFile> {
  return ReportRepository.updateReport(options);
}

/**
 * Enhance yard check filters
 * @param filters - Yard check filters
 * @returns The enhanced yard check filters
 */
const enhanceYardCheckFilters = async (filters: YardCheckFilters): Promise<YardCheckFilters> => {
  if (filters.landmark.names && filters.landmark.names.length > 0) {
    filters.landmark.names = await Promise.all(
      filters.landmark.names.map(async (landmark) => {
        const response = await getLandmarksByIds({ ids: [landmark.id] });
        const landmarkDetails = response[0];
        return { ...landmark, name: landmarkDetails.name };
      })
    );
  }

  if (filters.landmark.groups && filters.landmark.groups.length > 0) {
    filters.landmark.groups = await Promise.all(
      filters.landmark.groups.map(async (group) => {
        const response = await getLandmarkGroups();
        const groupDetails = response.find((g) => g.id === group.id);
        return { ...group, name: groupDetails?.name };
      })
    );
  }

  if (filters.landmark.types && filters.landmark.types.length > 0) {
    filters.landmark.types = await Promise.all(
      filters.landmark.types.map(async (type) => {
        const response = await getLandmarkTypes();
        const typeDetails = response.find((t) => t.id === type.id);
        return { ...type, name: typeDetails?.name };
      })
    );
  }

  if (filters.asset.types && filters.asset.types.length > 0) {
    filters.asset.types = await Promise.all(
      filters.asset.types.map(async (type) => {
        const response = await getAssetTypes();
        const typeDetails = response.find((t) => t.id === type.id);
        return { ...type, name: typeDetails?.name };
      })
    );
  }

  // TODO: Update asset ids with API response
  if (filters.asset.ids && filters.asset.ids.length > 0) {
    filters.asset.ids = await Promise.all(
      filters.asset.ids.map(async (asset) => {
        const response = await getAssetsByIds({ ids: [asset.id] });
        const assetDetails = response[0];
        return { id: assetDetails.id, assetId: assetDetails.assetId };
      })
    );
  }

  // TODO: Update asset ids with API response
  if (filters.asset.excludedIds && filters.asset.excludedIds.length > 0) {
    filters.asset.excludedIds = filters.asset.excludedIds.map((id) => ({
      ...id,
      assetId: `Asset ${id.id}`,
    }));
  }

  if (filters.location.countries && filters.location.countries.length > 0) {
    filters.location.countries = await Promise.all(
      filters.location.countries.map(async (country) => {
        const response = await getCountries();
        const countryDetails = response.find((c) => c.id === country.id);
        return { ...country, name: countryDetails?.name };
      })
    );
  }

  if (filters.location.states && filters.location.states.length > 0) {
    filters.location.states = await Promise.all(
      filters.location.states.map(async (state) => {
        const response = await getCountries();
        const countryDetails = response.find((c) => c.states.find((s) => s.id === state.id));
        const stateDetails = countryDetails?.states.find((s) => s.id === state.id);
        return { ...state, name: stateDetails?.name };
      })
    );
  }
  filters.operational.assetLocationType = "AT_LANDMARK";
  return filters;
};

/**
 * Enhance accrued distance filters
 * @param filters - Accrued distance filters
 * @returns The enhanced accrued distance filters
 */
const enhanceAccruedDistanceFilters = async (filters: AccruedDistanceFilters): Promise<AccruedDistanceFilters> => {
  // TODO: Update asset ids with API response
  if (filters.asset.ids && filters.asset.ids.length > 0) {
    filters.asset.ids = filters.asset.ids.map((id) => ({
      ...id,
      assetId: `Asset ${id.id}`,
    }));
  }

  return filters;
};

/**
 * Enhance a report
 * @param report - The report
 * @returns The enhanced report
 */
export async function enhanceReport(report: ReportFile): Promise<ReportFile> {
  const enhancedReport = structuredClone(report);

  if (enhancedReport.type === ReportTypes.YARD_CHECK) {
    enhancedReport.filters = await enhanceYardCheckFilters(enhancedReport.filters);
  } else if (enhancedReport.type === "ACCRUED_DISTANCE") {
    enhancedReport.filters = await enhanceAccruedDistanceFilters(enhancedReport.filters);
  }

  return enhancedReport;
}

/**
 * Get the report filters count
 * @param report - The report
 * @returns The report filters count
 */
export function getReportFiltersCount(report: ReportFile): number {
  if (report.type === "YARD_CHECK") {
    return (
      arrayFilterCount(report.filters.landmark.names) +
      arrayFilterCount(report.filters.landmark.groups) +
      arrayFilterCount(report.filters.landmark.types) +
      arrayFilterCount(report.filters.asset.ids) +
      arrayFilterCount(report.filters.asset.types) +
      arrayFilterCount(report.filters.asset.excludedIds) +
      arrayFilterCount(report.filters.location.countries) +
      arrayFilterCount(report.filters.location.states) +
      scalarFilterCount(report.filters.location.zipCode) +
      scalarFilterCount(report.filters.operational.lastReported) +
      scalarFilterCount(report.filters.operational.idleTime) +
      scalarFilterCount(report.filters.operational.assetLocationType)
    );
  }
  if (report.type === "ACCRUED_DISTANCE") {
    return arrayFilterCount(report.filters.asset.ids) + objectFilterCount(report.filters.operational.dateRange);
  }
  return 0;
}

/**
 * Parameters for report operations
 */
type ReportParams = { reportId: string };

/**
 * Parameters for sending a report
 */
export type SendReportParams = ReportParams & { emails: string[] };

/**
 * Parameters for running a on demand report
 */
export type RunOnDemandReportParams = ReportParams;

/**
 * Parameters for downloading a report
 */
export type DownloadReportParams = ReportParams;

/**
 * Parameters for deleting a report
 */
export type DeleteReportParams = ReportParams;

/**
 * Send a report
 * @param options - Parameters for sending a report
 * @returns The void
 */
export function sendReport(options: SendReportParams): Promise<void> {
  return ReportRepository.sendReport(options);
}

/**
 * Run a report on demand
 * @param options - Parameters for running a report on demand
 * @returns The report status
 */
export function runOnDemandReport(options: RunOnDemandReportParams): Promise<{ status: string }> {
  return ReportRepository.runOnDemandReport(options);
}

/**
 * Get a report download URL
 * @param options - Parameters for getting a report download URL
 * @returns The report download URL
 */
export function getReportDownloadURL(options: DownloadReportParams): string {
  return ReportRepository.getReportDownloadURL(options);
}

/**
 * Delete a report
 * @param options - Parameters for deleting a report
 * @returns The void
 */
export function deleteReport(options: DeleteReportParams): Promise<void> {
  return ReportRepository.deleteReport(options);
}

/**
 * Get reports for export
 * @param options - Parameters for reports for export
 * @param chunkSize - The chunk size
 * @returns The reports for export
 */
export async function getReportsForExport(chunkSize = 100): Promise<Array<ReportFile & { filtersCount: number }>> {
  const response = await ReportRepository.getReports({ limit: chunkSize, offset: 0 });
  const reports = response.reports;
  const total = response.totalCount;
  const remaining = total - reports.length;
  const pagesRemaining = Math.ceil(remaining / chunkSize);
  const remainingReports = await Promise.all(
    Array.from({ length: pagesRemaining }).map((_, index) => {
      return getReports({ limit: chunkSize, offset: (1 + index) * chunkSize });
    })
  );
  reports.push(...remainingReports.flatMap((report) => report.reports));
  const allReports = reports.map((report) => {
    return {
      ...report,
      filtersCount: getReportFiltersCount(report),
    };
  });
  return allReports;
}
