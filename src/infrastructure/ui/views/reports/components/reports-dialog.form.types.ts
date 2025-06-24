type BaseReportsDialogFormData = {
  reportName: string;
  type: ReportFile["type"];
  recipients: string[];
};

type OnceReport = BaseReportsDialogFormData & RecurrenceOnce;

type HourlyReport = BaseReportsDialogFormData & RecurrenceHourly;

type DailyReport = BaseReportsDialogFormData & RecurrenceDaily;

export type WeeklyReport = BaseReportsDialogFormData & RecurrenceWeekly;

type MonthlyReport = BaseReportsDialogFormData & RecurrenceMonthly;

type YearlyReport = BaseReportsDialogFormData & RecurrenceYearly;

export type ReportsDialogFormData =
  | OnceReport
  | HourlyReport
  | DailyReport
  | WeeklyReport
  | MonthlyReport
  | YearlyReport;

export type ReportsDialogFormProps = {
  reportType: ReportFile["type"];
  timezone: string;
  disableReportType?: boolean;
  report?: ReportFile;
  isEditing?: boolean;
};

export type DialogFormRef = {
  submit: () => ReportsDialogFormData | null;
};

export type ReportDialogProps = {
  open: boolean;
  onClose: () => void;
  report: ReportFile;
};
