import { AccruedDistanceAssetSortByField, YardCheckAssetSortByField } from "@/domain/services/asset/asset.service";
import { ReportDto, ReportDtoSchema } from "@/infrastructure/repositories/report/report-dto";
import { zodParse } from "@/infrastructure/zod-parse/zod-parse";

const getRecurrenceDetails = (dto: ReportDto): Recurrence => {
  const { recurType, startingFromDate, runAt, endingOnDate, timeZoneFullName } = dto;

  const recurrence = {
    start: startingFromDate ? new Date(startingFromDate) : null,
    time: runAt,
    timezone: timeZoneFullName ?? null,
    interval: getRecurrenceInterval(dto),
  };

  if (recurType === "WEEKLY") {
    if (!dto.weeklyConfig) {
      throw new Error("Invalid recurrence config");
    }

    return {
      ...recurrence,
      days: dto.weeklyConfig.daysOfWeek.map((day) => day - 1),
      frequency: recurType,
      end: endingOnDate ? new Date(endingOnDate) : null,
    };
  }
  if (recurType === "MONTHLY") {
    if (!dto.monthlyConfig) throw new Error("Invalid recurrence config");

    const { nthOccurrence, nthOccurrenceDayOfWeek } = dto.monthlyConfig;
    return {
      ...recurrence,
      day: nthOccurrenceDayOfWeek - 1,
      ordinal: nthOccurrence,
      frequency: recurType,
      end: endingOnDate ? new Date(endingOnDate) : null,
    };
  }

  if (recurType === "YEARLY") {
    if (!dto.yearlyConfig) throw new Error("Invalid recurrence config");

    const { nthOccurrence, nthOccurrenceDayOfWeek, months } = dto.yearlyConfig;
    return {
      ...recurrence,
      day: nthOccurrenceDayOfWeek - 1,
      ordinal: nthOccurrence,
      months: months.map((month) => month - 1),
      frequency: recurType,
      end: endingOnDate ? new Date(endingOnDate) : null,
    };
  }

  return {
    ...recurrence,
    frequency: recurType,
    interval: getRecurrenceInterval(dto),
    end: endingOnDate ? new Date(endingOnDate) : null,
  };
};

export function mapReportFileDtoToDomain(dto: ReportDto): ReportFile {
  const parsedReportDto = zodParse(ReportDtoSchema, dto);

  const { reportID, reportName, reportType, recipients, yardCheckFilter, accruedDistanceFilter, lastRunStatus } =
    parsedReportDto;

  const recurrence = getRecurrenceDetails(dto);

  const baseReport: BaseReport = {
    id: reportID,
    name: reportName,
    createdAt: dto.createdOnMilliUTC ? new Date(dto.createdOnMilliUTC) : null,
    recurrence,
    recipientsCount: recipients.length,
    recipients,
    fileName: reportName,
    nextRun: dto.nextRunScheduledOnMilliUTC ? new Date(dto.nextRunScheduledOnMilliUTC) : undefined,
    lastRun: dto.lastRunFinishedOnMilliUTC ? new Date(dto.lastRunFinishedOnMilliUTC) : undefined,
    status: lastRunStatus,
  };

  if (reportType === "YARD_CHECK") {
    return { ...baseReport, type: "YARD_CHECK", filters: mapYardCheckFiltersToDomain(yardCheckFilter) };
  }

  if (reportType === "ACCRUED_DISTANCE") {
    return {
      ...baseReport,
      type: "ACCRUED_DISTANCE",
      filters: mapAccruedDistanceFiltersToDomain(accruedDistanceFilter),
    };
  }

  throw new Error(`Invalid report type: ${reportType}`);
}

function getRecurrenceInterval(dto: ReportDto): number {
  const { recurType, isRepeatable } = dto;

  if (recurType === "ONCE" || !isRepeatable) {
    return 0;
  }
  const intervalMap = {
    HOURLY: dto.hourlyConfig?.intervalHours,
    DAILY: dto.dailyConfig?.intervalDays,
    WEEKLY: dto.weeklyConfig?.intervalWeeks,
    MONTHLY: dto.monthlyConfig?.intervalMonths,
    YEARLY: dto.yearlyConfig?.intervalYears,
  };
  const interval = intervalMap[recurType as keyof typeof intervalMap];
  if (interval === undefined) {
    throw new Error(`Invalid recurrence type: ${recurType}`);
  }

  return interval;
}

function mapYardCheckFiltersToDomain(filter: ReportDto["yardCheckFilter"]): YardCheckFilters {
  return {
    asset: {
      ids: (filter?.assetIDs ?? []).map((id) => ({ id })),
      types: filter?.assetTypeID ? [{ id: filter.assetTypeID }] : [],
      byTextSearch: filter?.searchKeyword || "",
    },
    location: {
      countries: filter?.countryAbbreviation ? [{ id: filter.countryAbbreviation }] : [],
      states: filter?.stateAbbreviation ? [{ id: filter.stateAbbreviation }] : [],
      zipCode: filter?.zipCode || undefined,
    },
    landmark: {
      names: filter?.geoInfoIDs?.map((id) => ({ id })),
      types: filter?.geoTypeID ? [{ id: filter.geoTypeID }] : undefined,
      groups: filter?.geoGrpIDs?.map((id) => ({ id })),
    },
    sensor: {
      cargoStatuses: filter?.cargoStatuses || undefined,
      motionStatuses: filter?.motionStatuses || undefined,
      volumetricStatuses: filter?.volumetricStatuses || undefined,
    },
    operational: {
      assetLocationType: "AT_LANDMARK",
      lastReported: filter?.reportedWithinPastDays || undefined,
      idleTime: filter?.idleTimeHoursGtThan || undefined,
    },
    display: {
      sortBy: filter?.sort
        ? {
            field: filter.sort[0].field as YardCheckAssetSortByField,
            order: filter.sort[0].order === "ASC" ? "asc" : "desc",
          }
        : undefined,
    },
  };
}

function mapAccruedDistanceFiltersToDomain(filter: ReportDto["accruedDistanceFilter"]): AccruedDistanceFilters {
  const dateRange = filter!.dateRange;

  return {
    asset: {
      ids: (filter?.assetIDs ?? []).map((id) => ({ id })),
    },
    operational: {
      dateRange: {
        from: new Date(dateRange.from),
        to: new Date(dateRange.to),
      },
    },
    display: {
      sortBy: filter?.sort
        ? {
            field: filter.sort[0].field as AccruedDistanceAssetSortByField,
            order: filter.sort[0].order === "ASC" ? "asc" : "desc",
          }
        : undefined,
    },
  };
}
