import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getReportFiltersCount, GetReportParams, getReports } from "@/domain/services/report/report.service";

export function useGetReports(options: GetReportParams) {
  return useQuery({
    queryKey: ["reports", ...Object.values(options)],
    queryFn: (context) => getReports(options, context),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
    select: (data) => ({
      ...data,
      reports: data.reports.map((report) => ({ ...report, filtersCount: getReportFiltersCount(report) })),
    }),
  });
}
