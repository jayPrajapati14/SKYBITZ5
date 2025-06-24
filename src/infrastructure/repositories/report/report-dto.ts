import { z } from "zod";
import { createPaginatedResponseSchema } from "../paginated-response-dto";

export const MonthSchema = z.number().int().min(1).max(12);

export const ReportDtoSchema = z
  .object({
    reportID: z.string(),
    reportName: z.string(),
    reportType: z.enum(["YARD_CHECK", "ACCRUED_DISTANCE"]),
    recurType: z.enum(["ONCE", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
    createdOnMilliUTC: z.number().nullable(),
    lastRunFinishedOnMilliUTC: z.number().nullable(),
    nextRunScheduledOnMilliUTC: z.number().nullable(),
    timeZoneFullName: z.string().nullish(),
    isRepeatable: z.boolean(),
    recipients: z.array(z.string()),
    runAt: z.string(),
    recurEveryNthTimes: z.number().int().nullable(),
    startingFromDate: z.string().date().nullable(),
    endingOnDate: z.string().date().nullish(),
    hourlyConfig: z
      .object({
        intervalHours: z.number().int(),
      })
      .nullable(),
    dailyConfig: z
      .object({
        intervalDays: z.number().int(),
      })
      .nullable(),
    weeklyConfig: z
      .object({
        intervalWeeks: z.number().int(),
        daysOfWeek: z.array(z.number().int()),
      })
      .nullable(),
    monthlyConfig: z
      .object({
        intervalMonths: MonthSchema,
        nthOccurrence: z.number().int(),
        nthOccurrenceDayOfWeek: z.number().int(),
      })
      .nullable(),
    yearlyConfig: z
      .object({
        intervalYears: z.number().int(),
        nthOccurrence: z.number().int(),
        nthOccurrenceDayOfWeek: z.number().int(),
        months: z.array(MonthSchema),
      })
      .nullable(),
    yardCheckFilter: z
      .object({
        geoTypeID: z.number().int().min(0).nullable(),
        geoInfoIDs: z.array(z.number().int().min(0)).max(25).nullable(),
        geoGrpIDs: z.array(z.number().int().min(0)).nullable(),
        assetIDs: z.array(z.number().int().min(0)).max(100).nullable(),
        assetTypeID: z.number().int().min(0).nullable(),
        searchKeyword: z.string().nullable().optional(),
        countryAbbreviation: z.string().nullable(),
        stateAbbreviation: z.string().nullable(),
        zipCode: z.string().min(1).max(100).nullable(),
        cargoStatuses: z.array(z.string()).nullable(),
        volumetricStatuses: z.array(z.string()).nullable().optional(),
        motionStatuses: z.array(z.string()).nullable().optional(),
        idleTimeHoursGtThan: z.number().nullish(),
        reportedWithinPastDays: z.number().min(1).max(31).nullable(),
        sort: z
          .array(
            z.object({
              field: z.string(),
              order: z.enum(["ASC", "DESC"]),
            })
          )
          .nullable(),
      })
      .nullable(),
    accruedDistanceFilter: z
      .object({
        dateRange: z.object({
          from: z.string().date(),
          to: z.string().date(),
        }),
        assetIDs: z.array(z.number().int().min(0)).optional(),
        sort: z
          .array(
            z.object({
              field: z.string(),
              order: z.enum(["ASC", "DESC"]),
            })
          )
          .nullable(),
      })
      .nullable(),
    lastRunStatus: z.enum(["IN_PROGRESS", "COMPLETED", "FAILED"]).nullable(),
  })
  .describe("ReportDto");

export const UnsavedReportDtoSchema = ReportDtoSchema.omit({
  reportID: true,
  reportName: true,
  createdOnMilliUTC: true,
  lastRunFinishedOnMilliUTC: true,
  nextRunScheduledOnMilliUTC: true,
  recurEveryNthTimes: true,
  lastRunStatus: true,
})
  .extend({
    name: z.string(),
  })
  .describe("UnsavedReportDto");

export const PaginatedReportDtoSchema = createPaginatedResponseSchema(ReportDtoSchema).describe("PaginatedReportDto");

export type ReportDto = z.infer<typeof ReportDtoSchema>;
export type UnsavedReportDto = z.infer<typeof UnsavedReportDtoSchema>;
export type PaginatedReportDto = z.infer<typeof PaginatedReportDtoSchema>;
