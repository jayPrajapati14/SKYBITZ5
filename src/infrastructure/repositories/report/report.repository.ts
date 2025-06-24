import {
  CreateReportParams,
  DownloadReportParams,
  RunOnDemandReportParams,
  SendReportParams,
  DeleteReportParams,
  UpdateReportParams,
} from "@/domain/services/report/report.service";
import { apiFetch } from "@/infrastructure/api-fetch/api-fetch";
import { PaginatedReportDto } from "./report-dto";
import { mapCreateReportParamsToDto } from "@/infrastructure/repositories/report/mappers/report.to-dto";
import { mapReportFileDtoToDomain } from "@/infrastructure/repositories/report/mappers/report.to-domain";
import { Metadata } from "@/domain/models/metadata";

/**
 * Parameters for getting reports
 */
type GetReportParams = {
  name?: string;
  limit?: number;
  offset?: number;
};

/**
 * Get reports
 * @param options - Parameters for getting reports
 * @returns The reports
 */
export async function getReports(
  options: GetReportParams,
  metadata?: Metadata
): PaginatedResponse<ReportFile, "reports"> {
  const url = "/api/v1/report/paginated";

  const params: Record<string, unknown> = {
    page: 1 + (options.offset ?? 0) / (options.limit ?? 50),
    size: options.limit ?? 50,
    filters: {
      name: options.name,
    },
  };

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<PaginatedReportDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const reports = response.data.map(mapReportFileDtoToDomain);
  const totalCount = response.totalRecords;

  return {
    reports,
    totalCount,
  };
}

/**
 * Create a report
 * @param options - Parameters for creating a report
 * @returns The report
 */
export async function createReport(options: CreateReportParams): Promise<ReportFile> {
  const url = "/api/v1/report";
  const payload = mapCreateReportParamsToDto(options);
  const response = await apiFetch<ReportFile>(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
}

/**
 * Update a report
 * @param options - Parameters for updating a report
 * @returns The report
 */
export async function updateReport(options: UpdateReportParams): Promise<ReportFile> {
  const url = `/api/v1/report/${options.id}`;
  const payload = mapCreateReportParamsToDto(options);
  const response = await apiFetch<ReportFile>(url, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response;
}

/**
 * Send a report
 * @param options - Parameters for sending a report
 * @returns The void
 */
export async function sendReport(options: SendReportParams): Promise<void> {
  const url = `/api/v1/report/${options.reportId}/email`;
  const response = await apiFetch<void>(url, {
    method: "POST",
    body: JSON.stringify(options.emails),
  });
  return response;
}

/**
 * Run a report on demand
 * @param options - Parameters for running a report on demand
 * @returns The report status
 */
export async function runOnDemandReport(options: RunOnDemandReportParams): Promise<{ status: string }> {
  const url = `/api/v1/report/${options.reportId}/on-demand`;
  const response = await apiFetch<{ status: string }>(url, {
    method: "GET",
  });
  return response;
}

/**
 * Get a report download URL
 * @param options - Parameters for getting a report download URL
 * @returns The report download URL
 */
export function getReportDownloadURL(options: DownloadReportParams): string {
  return `/api/v1/report/${options.reportId}/download`;
}

/**
 * Delete a report
 * @param options - Parameters for deleting a report
 * @returns The void
 */
export async function deleteReport(options: DeleteReportParams): Promise<void> {
  const url = `/api/v1/report/${options.reportId}`;
  const response = await apiFetch<void>(url, {
    method: "DELETE",
  });
  return response;
}
