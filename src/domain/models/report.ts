export const ReportTypes = {
  YARD_CHECK: "YARD_CHECK",
  ACCRUED_DISTANCE: "ACCRUED_DISTANCE",
} as const;

declare global {
  type Frequency = "ONCE" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  type ReportStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";

  type RecurrenceBase = {
    start: Nullable<Date>;
    end: Nullable<Date>;
    /**
     * @description Time is in HH:mm format in 24-hour format
     */
    time: string;
    timezone: Nullable<string>;
    interval: number;
  };

  type RecurrenceOnce = RecurrenceBase & { frequency: "ONCE" };

  type RecurrenceHourly = RecurrenceBase & { frequency: "HOURLY" };

  type RecurrenceDaily = RecurrenceBase & { frequency: "DAILY" };

  /**
   * @description Days are 1-7
   */
  type RecurrenceWeekly = RecurrenceBase & { frequency: "WEEKLY"; days: number[] };

  /**
   * @description Day is 1-31
   * @description Ordinal is 1-5
   */
  type RecurrenceMonthly = RecurrenceBase & { frequency: "MONTHLY"; ordinal: number; day: number };

  type RecurrenceYearly = RecurrenceBase & {
    frequency: "YEARLY";
    /**
     * @description Months are 1-12
     */
    months: number[];
    /**
     * @description Ordinal is 1-5
     */
    ordinal: number;
    /**
     * @description Day is 1-31
     */
    day: number;
  };

  type Recurrence =
    | RecurrenceOnce
    | RecurrenceHourly
    | RecurrenceDaily
    | RecurrenceWeekly
    | RecurrenceMonthly
    | RecurrenceYearly;

  export type BaseReport = {
    id: string;
    name: string;
    recurrence: Recurrence;
    lastRun?: Date;
    nextRun?: Date;
    recipientsCount: number;
    recipients: string[];
    fileName: string;
    createdAt: Nullable<Date>;
    status?: Nullable<ReportStatus>;
  };

  export type ReportViewType = (typeof ReportTypes)[keyof typeof ReportTypes];

  export type YardCheckReport = BaseReport & {
    type: Extract<ReportViewType, "YARD_CHECK">;
    filters: YardCheckFilters;
  };

  export type AccruedDistanceReport = BaseReport & {
    type: Extract<ReportViewType, "ACCRUED_DISTANCE">;
    filters: AccruedDistanceFilters;
  };

  export type ReportFile = YardCheckReport | AccruedDistanceReport;
}
