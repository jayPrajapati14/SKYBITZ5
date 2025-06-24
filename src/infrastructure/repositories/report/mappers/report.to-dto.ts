import { CreateReportParams } from "@/domain/services/report/report.service";
import { ReportDto, UnsavedReportDto } from "@/infrastructure/repositories/report/report-dto";
import { dayjs } from "@/infrastructure/dayjs/dayjs";

function mapYardCheckFilterToDto(filter: YardCheckFilters): ReportDto["yardCheckFilter"] {
  return {
    sort: filter.display?.sortBy
      ? [
          {
            field: filter.display.sortBy.field,
            order: filter.display.sortBy.order === "asc" ? "ASC" : "DESC",
          },
        ]
      : null,

    geoTypeID: filter.landmark?.types?.[0]?.id ?? null,
    geoInfoIDs: filter.landmark?.names?.map((name) => name.id) ?? null,
    geoGrpIDs: filter.landmark?.groups?.map((group) => group.id) ?? null,
    assetIDs: filter.asset?.ids?.map((id) => id.id) ?? null,
    assetTypeID: filter.asset?.types?.[0]?.id ?? null,
    countryAbbreviation: filter.location?.countries?.[0]?.id ?? null,
    stateAbbreviation: filter.location?.states?.[0]?.id ?? null,
    zipCode: filter.location?.zipCode ?? null,
    cargoStatuses: filter.sensor?.cargoStatuses ?? null,
    motionStatuses: filter.sensor?.motionStatuses ?? null,
    volumetricStatuses: filter.sensor?.volumetricStatuses ?? null,
    reportedWithinPastDays: filter.operational?.lastReported ?? null,
    idleTimeHoursGtThan: filter.operational?.idleTime ?? null,
    searchKeyword: filter.asset?.byTextSearch ?? null,
  };
}

function mapAccruedDistanceFilterToDto(filter: AccruedDistanceFilters): ReportDto["accruedDistanceFilter"] {
  return {
    assetIDs: filter.asset?.ids?.map((id) => id.id) ?? [],
    dateRange: {
      from: filter.operational.dateRange.from.toISOString(),
      to: filter.operational.dateRange.to.toISOString(),
    },
    sort: filter.display?.sortBy
      ? [
          {
            field: filter.display.sortBy.field,
            order: filter.display.sortBy.order === "asc" ? "ASC" : "DESC",
          },
        ]
      : null,
  };
}

export function mapCreateReportParamsToDto(options: CreateReportParams): UnsavedReportDto {
  const { name, type, recurrence, recipients, filters } = options;
  const formattedStartDate = recurrence.start ? dayjs(recurrence.start).format("YYYY-MM-DD") : null;
  const formattedEndDate = recurrence.end ? dayjs(recurrence.end).format("YYYY-MM-DD") : null;
  const unsavedReport: UnsavedReportDto = {
    name,
    reportType: type,
    recurType: recurrence.frequency,
    timeZoneFullName: recurrence.timezone,
    isRepeatable: recurrence.frequency !== "ONCE",
    startingFromDate: formattedStartDate,
    runAt: recurrence.time,
    recipients,
    endingOnDate: formattedEndDate,
    hourlyConfig: null,
    dailyConfig: null,
    weeklyConfig: null,
    monthlyConfig: null,
    yearlyConfig: null,
    accruedDistanceFilter: null,
    yardCheckFilter: null,
  };

  if (recurrence.frequency === "HOURLY") {
    unsavedReport.hourlyConfig = { intervalHours: recurrence.interval };
  }

  if (recurrence.frequency === "DAILY") {
    unsavedReport.dailyConfig = { intervalDays: recurrence.interval };
  }

  if (recurrence.frequency === "WEEKLY") {
    unsavedReport.weeklyConfig = {
      intervalWeeks: recurrence.interval,
      daysOfWeek: recurrence.days.map((day) => day + 1),
    };
  }

  if (recurrence.frequency === "MONTHLY") {
    unsavedReport.monthlyConfig = {
      intervalMonths: recurrence.interval,
      nthOccurrence: recurrence.ordinal,
      nthOccurrenceDayOfWeek: recurrence.day + 1,
    };
  }

  if (recurrence.frequency === "YEARLY") {
    unsavedReport.yearlyConfig = {
      intervalYears: recurrence.interval,
      months: recurrence.months.map((month) => month + 1),
      nthOccurrence: recurrence.ordinal,
      nthOccurrenceDayOfWeek: recurrence.day + 1,
    };
  }

  if (type === "YARD_CHECK" && filters.type === "YARD_CHECK") {
    unsavedReport.yardCheckFilter = mapYardCheckFilterToDto(filters.values);
  }
  if (type === "ACCRUED_DISTANCE" && filters.type === "ACCRUED_DISTANCE") {
    unsavedReport.accruedDistanceFilter = mapAccruedDistanceFilterToDto(filters.values);
  }

  return unsavedReport;
}
