import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/navbar/navbar";
import { enhanceReport, getReportDownloadURL, ReportSortBy } from "@/domain/services/report/report.service";
import { queryClient } from "@/infrastructure/query-client";
import { APP_LINKS } from "@/routes";
import { useAccruedDistanceActions } from "@/store/accrued-distance.store";
import { useReportsActions, useReportsPaginationModel, useReportsSortModel } from "@/store/reports.store";
import { useUiStore } from "@/store/ui.store";
import { useYardCheckActions } from "@/store/yard-check.store";
import { Layout } from "../layout/layout";
import { ReportsTable } from "./components/reports-table";
import { useGetReports } from "./hooks/use-get-reports";
import { useState } from "react";
import { ViewReportConfirmationDialog } from "./components/view-report-confirmation-dialog";
import { useShowNotification } from "@/components/notifications/useShowNotification";
import { ReportModal } from "@/views/reports/components/reports-modal";
import { Input } from "@/components/input/input";
import { Search } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { routeConfigs } from "@/infrastructure/ui/routes";

export function Reports() {
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
  const [searchValue, setSearchValue] = useState("");

  const reportsQuery = useGetReports({
    name: searchValue,
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

  return (
    <>
      <Layout.Title>Reporting</Layout.Title>
      <Layout.Controls>
        <NavBar
          leftLinks={APP_LINKS.left}
          rightLinks={APP_LINKS.right}
          filtersCount={0}
          toggleDrawer={toggleDrawer}
          showFilters={false}
        />
      </Layout.Controls>

      <Layout.Content>
        <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between tw-pl-px">
          <Input
            startIcon={<Search fontSize="small" className="tw-mr-1.5" htmlColor={grey[600]} />}
            placeholder="Find..."
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            clear={() => setSearchValue("")}
            sx={{
              "& .MuiInputBase-root": {
                width: "300px",
                height: "36px",
                minHeight: "36px",
              },
            }}
          />
        </div>
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
        />
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
