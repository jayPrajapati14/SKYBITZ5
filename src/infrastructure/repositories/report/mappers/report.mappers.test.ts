import { describe, expect, it } from "vitest";
import { mapReportFileDtoToDomain } from "./report.to-domain";
import { mapCreateReportParamsToDto } from "./report.to-dto";
import { ReportDto } from "@/infrastructure/repositories/report/report-dto";
import { CreateReportParams } from "@/domain/services/report/report.service";

describe("Report Mappers", () => {
  describe("mapReportFileDtoToDomain", () => {
    it("should correctly map a YARD_CHECK type report", () => {
      const mockDto: ReportDto = {
        reportID: "123",
        reportName: "Test Report",
        reportType: "YARD_CHECK",
        recurType: "WEEKLY",
        createdOnMilliUTC: 1234567890000,
        lastRunFinishedOnMilliUTC: 1234567890000,
        nextRunScheduledOnMilliUTC: 1234567890000,
        timeZoneFullName: "America/New_York",
        isRepeatable: true,
        recipients: ["test@test.com"],
        runAt: "10:00",
        recurEveryNthTimes: 1,
        startingFromDate: "2024-02-20",
        endingOnDate: "2024-03-20",
        hourlyConfig: null,
        dailyConfig: null,
        monthlyConfig: null,
        yearlyConfig: null,
        accruedDistanceFilter: null,
        weeklyConfig: {
          intervalWeeks: 1,
          daysOfWeek: [1, 3, 5],
        },
        yardCheckFilter: {
          assetIDs: [1, 2, 3],
          assetTypeID: 1,
          geoTypeID: 1,
          geoInfoIDs: [1, 2],
          geoGrpIDs: [1],
          countryAbbreviation: "US",
          stateAbbreviation: "NY",
          zipCode: "12345",
          cargoStatuses: ["LOADED"],
          motionStatuses: ["START"],
          volumetricStatuses: ["LOADED"],
          idleTimeHoursGtThan: 24,
          reportedWithinPastDays: 7,
          sort: [{ field: "assetId", order: "ASC" }],
          searchKeyword: "dummy search",
        },
        lastRunStatus: "COMPLETED",
      };

      const result = mapReportFileDtoToDomain(mockDto);

      expect(result).toEqual({
        id: "123",
        name: "Test Report",
        type: "YARD_CHECK",
        createdAt: new Date(1234567890000),
        nextRun: new Date(1234567890000),
        lastRun: new Date(1234567890000),
        recipientsCount: 1,
        recipients: ["test@test.com"],
        fileName: "Test Report",
        recurrence: {
          frequency: "WEEKLY",
          interval: 1,
          start: new Date("2024-02-20"),
          end: new Date("2024-03-20"),
          time: "10:00",
          days: [0, 2, 4],
          timezone: "America/New_York",
        },
        filters: {
          asset: {
            ids: [{ id: 1 }, { id: 2 }, { id: 3 }],
            types: [{ id: 1 }],
            byTextSearch: "dummy search",
          },
          location: {
            countries: [{ id: "US" }],
            states: [{ id: "NY" }],
            zipCode: "12345",
          },
          landmark: {
            names: [{ id: 1 }, { id: 2 }],
            types: [{ id: 1 }],
            groups: [{ id: 1 }],
          },
          sensor: {
            cargoStatuses: ["LOADED"],
            motionStatuses: ["START"],
            volumetricStatuses: ["LOADED"],
          },
          operational: {
            lastReported: 7,
            idleTime: 24,
            assetLocationType: "AT_LANDMARK",
          },
          display: {
            sortBy: {
              field: "assetId",
              order: "asc",
            },
          },
        },
        status: "COMPLETED",
      });
    });

    it("should correctly map an ACCRUED_DISTANCE type report", () => {
      const mockDto: ReportDto = {
        reportID: "123",
        reportName: "Test Report",
        reportType: "ACCRUED_DISTANCE",
        recurType: "DAILY",
        createdOnMilliUTC: 1234567890000,
        timeZoneFullName: "America/New_York",
        isRepeatable: true,
        recipients: ["test@test.com"],
        runAt: "10:00",
        startingFromDate: "2024-02-20",
        recurEveryNthTimes: 1,
        dailyConfig: {
          intervalDays: 1,
        },
        hourlyConfig: null,
        weeklyConfig: null,
        monthlyConfig: null,
        yearlyConfig: null,
        lastRunFinishedOnMilliUTC: 1234567890000,
        nextRunScheduledOnMilliUTC: 1234567890000,
        yardCheckFilter: null,
        accruedDistanceFilter: {
          assetIDs: [1, 2, 3],
          dateRange: {
            from: "2024-02-20",
            to: "2024-03-20",
          },
          sort: [{ field: "assetId", order: "ASC" as const }],
        },
        lastRunStatus: "COMPLETED",
      };

      const result = mapReportFileDtoToDomain(mockDto);

      expect(result.type).toBe("ACCRUED_DISTANCE");
      expect(result.filters).toEqual({
        asset: {
          ids: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
        operational: {
          dateRange: {
            from: new Date("2024-02-20"),
            to: new Date("2024-03-20"),
          },
        },
        display: {
          sortBy: {
            field: "assetId",
            order: "asc",
          },
        },
      });
    });

    // TODO: Add tests for weekly monthly and yearly reports

    it("should throw error for invalid report type", () => {
      const mockDto = {
        reportID: "123",
        reportName: "Test Report",
        reportType: "INVALID_TYPE",
        recurType: "DAILY",
        createdOnMilliUTC: 1234567890000,
        timezoneFullName: "America/New_York",
        isRepeatable: true,
        recipients: [],
        runAt: "10:00",
        startingFromDate: "2024-02-20T10:00:00.000Z",
        recurEveryNthTimes: 1,
        dailyConfig: {
          intervalDays: 1,
        },
      } as unknown as ReportDto;

      expect(() => mapReportFileDtoToDomain(mockDto)).toThrow("Error parsing Report");
    });
  });

  describe("mapCreateReportParamsToDto", () => {
    it("should correctly map createParams to dto for a daily report", () => {
      const createParams: CreateReportParams = {
        name: "Daily Test Report",
        type: "YARD_CHECK",
        recurrence: {
          frequency: "DAILY",
          interval: 2,
          start: new Date("2024-02-20"),
          end: new Date("2024-03-20"),
          time: "15:30",
          timezone: "America/New_York",
        },
        recipients: ["test@test.com", "test2@test.com"],
        filters: {
          type: "YARD_CHECK",
          values: {
            landmark: {},
            location: {},
            sensor: {},
            asset: {
              ids: [{ id: 1 }, { id: 2 }],
            },
            operational: {
              lastReported: 3,
              idleTime: 12,
              assetLocationType: "AT_LANDMARK",
            },
            display: {
              sortBy: {
                field: "idleTimeHours",
                order: "desc",
              },
            },
          },
        },
      };

      const result = mapCreateReportParamsToDto(createParams);

      expect(result).toMatchObject({
        name: "Daily Test Report",
        reportType: "YARD_CHECK",
        recurType: "DAILY",
        isRepeatable: true,
        dailyConfig: {
          intervalDays: 2,
        },
        yardCheckFilter: {
          assetIDs: [1, 2],
          idleTimeHoursGtThan: 12,
          reportedWithinPastDays: 3,
          sort: [{ field: "idleTimeHours", order: "DESC" }],
        },
      });
    });

    it("should correctly map createParams to dto for a weekly report", () => {
      const createParams: CreateReportParams = {
        name: "Test Report",
        type: "YARD_CHECK",
        recurrence: {
          frequency: "WEEKLY",
          interval: 1,
          start: new Date("2024-02-20T10:00:00.000Z"),
          end: new Date("2024-03-20T10:00:00.000Z"),
          time: "10:00",
          days: [1, 3, 5],
          timezone: "America/New_York",
        },
        recipients: ["test@test.com"],
        filters: {
          type: "YARD_CHECK",
          values: {
            asset: {
              ids: [{ id: 1 }, { id: 2 }],
              types: [{ id: 1 }],
            },
            landmark: {
              names: [{ id: 1 }],
              types: [{ id: 1 }],
              groups: [{ id: 1 }],
            },
            location: {
              countries: [{ id: "US" }],
              states: [{ id: "NY" }],
              zipCode: "12345",
            },
            sensor: {
              cargoStatuses: ["LOADED"],
              motionStatuses: ["START"],
              volumetricStatuses: ["LOADED"],
            },
            operational: {
              lastReported: 7,
              idleTime: 24,
              assetLocationType: "AT_LANDMARK",
            },
            display: {
              sortBy: {
                field: "idleTimeHours",
                order: "asc",
              },
            },
          },
        },
      };

      const result = mapCreateReportParamsToDto(createParams);

      expect(result).toMatchObject({
        name: "Test Report",
        reportType: "YARD_CHECK",
        recurType: "WEEKLY",
        isRepeatable: true,
        weeklyConfig: {
          intervalWeeks: 1,
          daysOfWeek: [2, 4, 6],
        },
        yardCheckFilter: {
          assetIDs: [1, 2],
          assetTypeID: 1,
          geoTypeID: 1,
          geoInfoIDs: [1],
          geoGrpIDs: [1],
          countryAbbreviation: "US",
          stateAbbreviation: "NY",
          zipCode: "12345",
          cargoStatuses: ["LOADED"],
          motionStatuses: ["START"],
          volumetricStatuses: ["LOADED"],
          idleTimeHoursGtThan: 24,
          reportedWithinPastDays: 7,
          sort: [{ field: "idleTimeHours", order: "ASC" }],
        },
      });
    });

    it("should correctly map createParams to dto for a monthly report", () => {
      const createParams: CreateReportParams = {
        name: "Monthly Test Report",
        type: "YARD_CHECK",
        recurrence: {
          frequency: "MONTHLY",
          interval: 1,
          start: new Date("2024-02-20T10:00:00.000Z"),
          end: new Date("2024-12-20T10:00:00.000Z"),
          time: "09:00",
          ordinal: 1,
          day: 4,
          timezone: "America/New_York",
        },
        recipients: ["test@test.com"],
        filters: {
          type: "YARD_CHECK",
          values: {
            asset: {},
            landmark: {},
            location: {},
            sensor: {},
            operational: {
              assetLocationType: "AT_LANDMARK",
            },
            display: {},
          },
        },
      };

      const result = mapCreateReportParamsToDto(createParams);

      expect(result).toMatchObject({
        name: "Monthly Test Report",
        reportType: "YARD_CHECK",
        recurType: "MONTHLY",
        isRepeatable: true,
        monthlyConfig: {
          intervalMonths: 1,
          nthOccurrence: 1,
          nthOccurrenceDayOfWeek: 5,
        },
        yardCheckFilter: {
          assetIDs: null,
          geoInfoIDs: null,
          cargoStatuses: null,
        },
      });
    });

    it("should correctly map createParams to dto for a yearly report", () => {
      const createParams: CreateReportParams = {
        name: "Yearly Test Report",
        type: "YARD_CHECK",
        recurrence: {
          frequency: "YEARLY",
          interval: 1,
          start: new Date("2024-02-20T10:00:00.000Z"),
          end: new Date("2026-02-20T10:00:00.000Z"),
          time: "09:00",
          months: [1],
          ordinal: 1,
          day: 4,
          timezone: "America/New_York",
        },
        recipients: ["test@test.com"],
        filters: {
          type: "YARD_CHECK",
          values: {
            asset: {},
            landmark: {},
            location: {},
            sensor: {},
            operational: {
              assetLocationType: "AT_LANDMARK",
            },
            display: {},
          },
        },
      };

      const result = mapCreateReportParamsToDto(createParams);

      expect(result).toMatchObject({
        name: "Yearly Test Report",
        reportType: "YARD_CHECK",
        recurType: "YEARLY",
        isRepeatable: true,
        yearlyConfig: {
          intervalYears: 1,
          nthOccurrence: 1,
          months: [2],
          nthOccurrenceDayOfWeek: 5,
        },
        yardCheckFilter: {
          assetIDs: null,
          geoInfoIDs: null,
          cargoStatuses: null,
        },
      });
    });
  });
});
