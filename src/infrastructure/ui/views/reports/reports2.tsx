import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/navbar/navbar";
import { enhanceReport, getReportDownloadURL, ReportSortBy } from "@/domain/services/report/report.service";
import { queryClient } from "@/infrastructure/query-client";
import { useAccruedDistanceActions } from "@/store/accrued-distance.store";
import { useReportsActions, useReportsPaginationModel, useReportsSortModel } from "@/store/reports.store";
import { useUiStore } from "@/store/ui.store";
import { useYardCheckActions } from "@/store/yard-check.store";
import { Layout } from "../layout/layout";
import { ReportsTable } from "./components/reports-table-2";
import { useGetReports } from "./hooks/use-get-reports";
import { useState } from "react";
import { ViewReportConfirmationDialog } from "./components/view-report-confirmation-dialog";
import { useShowNotification } from "@/components/notifications/useShowNotification";
import { ReportModal } from "@/views/reports/components/reports-modal";
import { routeConfigs } from "@/infrastructure/ui/routes";
import { ReportsDownloadMenu } from "./components/reports-download-menu";

export function Reports2() {
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  const paginationModel = useReportsPaginationModel();
  const sortModel = useReportsSortModel();
  const { setPaginationModel, setSortModel } = useReportsActions();
  const { fillViewFilters: resetYardFilters } = useYardCheckActions(true);
  const { fillViewFilters: resetAccruedDistanceFilters } = useAccruedDistanceActions(true);
  const navigate = useNavigate();
  const [isEnhancingReport, setIsEnhancingReport] = useState(false);
  const [selectedViewReport, setSelectedViewReport] = useState<ReportFile | null>(null);
  const [selectedEditReport, setSelectedEditReport] = useState<ReportFile | null>(null);
  const showNotification = useShowNotification();

  const reportsQuery = useGetReports({
    limit: paginationModel.pageSize,
    offset: paginationModel.pageSize * paginationModel.page,
    sortBy: sortModel?.[0] as ReportSortBy,
  });
  const handleViewReport = (report: ReportFile) => {
    setSelectedViewReport(report);
  };

  const handleEditReport = (report: ReportFile) => {
    setSelectedEditReport(report);
  };

  const handleDownloadReport = (report: ReportFile) => {
    const reportUrl = getReportDownloadURL({ reportId: report.id });
    window.open(reportUrl, "_blank");
  };

  const onConfirmViewReport = async () => {
    if (!selectedViewReport) return;

    setIsEnhancingReport(true);
    try {
      const enhancedReport = await queryClient.fetchQuery({
        queryKey: ["enhanced-report", selectedViewReport.id],
        queryFn: () => enhanceReport(selectedViewReport),
        staleTime: 1000 * 60 * 5,
      });
      if (selectedViewReport.type === "YARD_CHECK") {
        resetYardFilters(enhancedReport.filters as YardCheckFilters);
        navigate(routeConfigs.yardCheck.path);
      } else {
        resetAccruedDistanceFilters(enhancedReport.filters as AccruedDistanceFilters);
        navigate(routeConfigs.accruedDistance.path);
      }
    } catch (error) {
      showNotification({
        message: `An error occurred while processing the report filters: ${error}`,
        type: "error",
      });
    } finally {
      setIsEnhancingReport(false);
      setSelectedViewReport(null);
    }
  };

  const menu = {
    label: "Reports",
    path: "/ng/reports-2",
  };

  return (
    <>
      <Layout.Title>Reporting</Layout.Title>
      <Layout.Controls>
        <NavBar
          leftLinks={[menu]}
          rightSection={<ReportsDownloadMenu />}
          filtersCount={0}
          toggleDrawer={toggleDrawer}
          showFilters={false}
        />
      </Layout.Controls>

      <Layout.Content>
        <div className="tw-grid tw-h-full tw-grid-cols-12 tw-gap-3">
          <div className="tw-col-span-12 tw-row-span-12">
            <ReportsTable
              onSortModelChange={setSortModel}
              sortModel={sortModel}
              rows={reportsQuery.data?.reports}
              loading={reportsQuery.isFetching}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              totalCount={reportsQuery.data?.totalCount ?? 0}
              onViewReport={handleViewReport}
              onEditReport={handleEditReport}
              onDownloadReport={handleDownloadReport}
              error={reportsQuery.error?.message}
              header={
                <div className="tw-flex tw-items-center tw-gap-4">
                  <div className="tw-text-base tw-font-medium tw-text-text-secondary">Reports</div>
                  <div className="tw-text-sm tw-text-gray-500">
                    RESULTS: {(reportsQuery.data?.totalCount ?? 0).toLocaleString()}
                  </div>
                </div>
              }
            />
          </div>
        </div>
      </Layout.Content>

      <ViewReportConfirmationDialog
        isDialogOpen={Boolean(selectedViewReport)}
        setIsDialogOpen={() => setSelectedViewReport(null)}
        isEnhancingReport={isEnhancingReport}
        onConfirmViewReport={onConfirmViewReport}
      />

      {selectedEditReport && (
        <ReportModal
          open={Boolean(selectedEditReport)}
          onClose={() => setSelectedEditReport(null)}
          report={selectedEditReport}
        />
      )}
    </>
  );
}
