import { http, HttpResponse, delay } from "msw";
import {
  accruedDistanceAssets,
  yardCheckAssets,
  assetTypes,
  landmarkGroups,
  landmarks,
  landmarkTypes,
  reports,
  sensors,
  quickSearchAssets,
  genericAssets,
  idleAssets,
  generateRandomLandmarkData,
  expandedData,
} from "./data";
import {
  AccruedDistancePayloadDto,
  YardCheckAssetPayloadDto,
  GenericAssetPayloadDto,
  IdleAssetPayloadDto,
  IdleAssetAggregateDto,
  YardCheckAssetAggregateDto,
  MovingAssetAggregateDto,
  YardCheckMapAssetDto,
  AssetIdPayloadDto,
  AssetIdDto,
} from "@/infrastructure/repositories/asset/asset-dto";
import { LandmarkPayloadDto, LandmarkDto } from "@/infrastructure/repositories/landmark/landmark-dto";
import { ReportDto, UnsavedReportDto } from "@/infrastructure/repositories/report/report-dto";
import { countries } from "./countries";

const unique = <T>(items: T[]): T[] => [...new Set(items)];

// TODO: fix sorting on mock data
//
// const sortEntities = <T>(array: T[], sortBy: keyof T | `-${string & keyof T}`): T[] => {
//   const field = sortBy.toString().replace("-", "") as keyof T;
//   const direction = sortBy.toString().startsWith("-") ? "desc" : "asc";

//   const sortedArray = [...array].sort((a, b) => {
//     if (typeof a[field] === "string" && typeof b[field] === "string") {
//       return (a[field] as string).localeCompare(b[field] as string);
//     }
//     if (typeof a[field] === "number" && typeof b[field] === "number") {
//       return (a[field] as number) - (b[field] as number);
//     }
//     return 0;
//   });

//   return direction === "desc" ? sortedArray.reverse() : sortedArray;
// };

const MOCK_API_URL = import.meta.env.VITE_API_URL;

export const handlers = [
  http.post(`${MOCK_API_URL}/api/v1/yard-check`, async ({ request }) => {
    const body = (await request.json()) as YardCheckAssetPayloadDto;

    const landmarkIds = body?.filters?.geoInfoIDs ?? [];
    const groups = body?.filters?.geoGrpIDs ?? [];
    const landmarkTypes = body?.filters?.geoTypeID ? [body.filters.geoTypeID] : [];
    const ids = body?.filters?.assetIDs ?? [];
    const types = body?.filters?.assetTypeID ? [body.filters.assetTypeID] : [];
    // const excludedAssetIds = (body?.excludedAssetIds as string[]).map(Number);
    const countries = body?.filters?.countryAbbreviation ? [body.filters.countryAbbreviation] : [];
    const state = body?.filters?.stateAbbreviation ? [body.filters.stateAbbreviation] : [];
    const zipCode = body?.filters?.zipCode as string;
    const idleTime = body?.filters?.idleTimeHoursGtThan as number;
    const lastReported = body?.filters?.reportedWithinPastDays as number;

    const statuses = body?.filters?.cargoStatuses as string[];

    const page = (body?.page as number) ?? 0;
    const size = (body?.size as number) ?? 50;

    const limit = size;
    const offset = (page - 1) * size;

    // const sortBy = body?.sortBy as `${"-" | ""}${keyof YardCheckAssetDto}`;

    const filteredAssets = yardCheckAssets
      .filter((asset) => !landmarkIds || landmarkIds?.length === 0 || landmarkIds?.includes(asset.landmarkID))
      .filter(
        (asset) => !groups || groups?.length === 0 || (asset.landmarkGroupID && groups?.includes(asset.landmarkGroupID))
      )
      .filter(
        (asset) =>
          !landmarkTypes ||
          landmarkTypes.length === 0 ||
          (asset.landmarkTypeId && landmarkTypes?.includes(asset.landmarkTypeId))
      )
      .filter((asset) => !ids || ids?.length === 0 || ids?.includes(asset.assetID))
      .filter((asset) => !types || types?.length === 0 || (asset.typeId && types?.includes(asset.typeId)))
      // .filter((asset) => !excludedAssetIds?.includes(asset.assetID)) // TODO: review this with backend team
      .filter((asset) => !countries || countries?.length === 0 || (asset.country && countries?.includes(asset.country)))
      .filter(
        (asset) =>
          !state || state?.length === 0 || (asset.stateAbbreviation && state?.includes(asset.stateAbbreviation))
      )
      .filter((asset) => !zipCode || zipCode.length === 0 || asset.zipCode === zipCode)
      .filter((asset) => !idleTime || asset.idleTimeHours > idleTime)
      .filter(
        (asset) => !lastReported || asset.lastReportedTimeMillisUTC > Date.now() - lastReported * 24 * 60 * 60 * 1000
      )
      .filter(
        (asset) =>
          !statuses ||
          statuses?.length === 0 ||
          statuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );

    // if (sortBy) {
    //   filteredAssets = sortEntities<YardCheckAssetDto>(filteredAssets, sortBy);
    // }

    await delay();
    return HttpResponse.json({
      data: filteredAssets.slice(offset, offset + limit),
      totalRecords: filteredAssets.length,
      pageNumber: page + 1,
      pageSize: size,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/mileage/accrued-distance/range`, async ({ request }) => {
    const body = (await request.json()) as AccruedDistancePayloadDto;

    const ids = body.filters.assetIDs?.map(Number);

    const page = (body?.page as number) ?? 0;
    const size = (body?.size as number) ?? 50;

    const limit = size;
    const offset = (page - 1) * size;

    // TODO: update query with dateRange field

    // const sortBy = body.filters.sort?.[0] as `${"-" | ""}${keyof AccruedDistanceAssetDto}`;

    const filteredAssets = accruedDistanceAssets.filter(
      (asset) => !ids || ids?.length === 0 || ids?.includes(asset.assetID)
    );

    // if (sortBy) {
    //   filteredAssets = sortEntities<AccruedDistanceAssetDto>(filteredAssets, sortBy);
    // }

    await delay();
    return HttpResponse.json({
      data: filteredAssets.slice(offset, offset + limit),
      totalRecords: filteredAssets.length,
      pageNumber: page + 1,
      pageSize: size,
    });
  }),

  http.get(`${MOCK_API_URL}/api/v1/landmark`, async ({ request }) => {
    const url = new URL(request.url);

    const name = url.searchParams.get("keyword") ?? "";

    const filteredLandmarks = landmarks.filter(
      (landmark) => !name || landmark.name?.toLowerCase().includes(name.toLowerCase())
    );
    await delay();
    return HttpResponse.json(filteredLandmarks.slice(0, 50));
  }),

  http.get("https://nextgen-api/landmarks", async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") ?? "";
    const ids = url.searchParams.get("ids")?.split(",").map(Number);
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filteredLandmarks = landmarks
      .filter((landmark) => !name || landmark.name?.toLowerCase().includes(name.toLowerCase()))
      .filter((landmark) => !ids || ids?.length === 0 || ids?.includes(landmark.id));
    await delay();
    return HttpResponse.json(filteredLandmarks.slice(0, limit));
  }),

  http.get(`${MOCK_API_URL}/api/v1/asset`, async ({ request }) => {
    const url = new URL(request.url);
    const assetId = url.searchParams.get("keyword") ?? "";

    const filteredAssets = yardCheckAssets
      .filter((asset) => !assetId || asset.custAssetID.toLowerCase().includes(assetId.toLowerCase()))
      .map((asset) => ({ id: asset.assetID, custAssetID: asset.custAssetID }));

    await delay();
    return HttpResponse.json(filteredAssets.slice(0, 50));
  }),

  http.get(`${MOCK_API_URL}/api/v1/landmark/groups`, async () => {
    await delay();
    return HttpResponse.json(landmarkGroups);
  }),

  http.get(`${MOCK_API_URL}/api/v1/landmark/types`, async () => {
    await delay();
    return HttpResponse.json(landmarkTypes);
  }),

  http.get(`${MOCK_API_URL}/api/v1/asset/types`, async () => {
    await delay();
    return HttpResponse.json(assetTypes);
  }),

  http.get("https://nextgen-api/sensors", async ({ request }) => {
    const url = new URL(request.url);
    const statuses = url.searchParams.get("statuses")?.split(",");
    const ids = url.searchParams.get("ids")?.split(",");
    const limit = Number(url.searchParams.get("limit") ?? 10);

    const filteredSensors = sensors.filter((sensor) => {
      return (
        (!statuses || statuses?.length === 0 || statuses?.includes(sensor.sensorValue)) &&
        (!ids || ids?.length === 0 || ids?.includes(sensor.sensorType))
      );
    });
    await delay();
    return HttpResponse.json(filteredSensors.slice(0, limit));
  }),

  http.get("https://nextgen-api/cargo-statuses", async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") ?? "";
    const statuses = unique(
      sensors
        .filter((sensor) => sensor.sensorValue.toLowerCase().includes(name.toLowerCase()))
        .map((sensor) => sensor.sensorValue)
    );
    await delay();
    return HttpResponse.json(statuses);
  }),

  http.post(`${MOCK_API_URL}/api/v1/report/paginated`, async ({ request }) => {
    const body = (await request.json()) as { filters: { name: string }; limit: number; offset: number };
    const name = String((body?.filters?.name as string) ?? "");
    const limit = Number(body.limit ?? 50);
    const offset = Number(body.offset ?? 0);

    const filteredReports = reports.filter(
      (report) => !name || (report.reportName && report.reportName?.toLowerCase().includes(name.toLowerCase()))
    );

    await delay();
    return HttpResponse.json({
      data: filteredReports.slice(offset, offset + limit),
      totalRecords: filteredReports.length,
      pageSize: limit,
      pageNumber: offset / limit + 1,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/report`, async ({ request }) => {
    await delay();
    const report = (await request.json()) as UnsavedReportDto;
    const newReport: ReportDto = {
      ...report,
      reportID: `REPORT_${(Math.random() * 9000).toFixed(0)}`,
      startingFromDate: report.startingFromDate?.split("T")[0] ?? null,
      endingOnDate: report.endingOnDate?.split("T")[0] ?? null,
      reportName: report.name,
      reportType: report.reportType,
      recurType: report.recurType,
      timeZoneFullName: report.timeZoneFullName,
      isRepeatable: report.isRepeatable,
      createdOnMilliUTC: Date.now(),
      recurEveryNthTimes: null,
      lastRunFinishedOnMilliUTC: null,
      nextRunScheduledOnMilliUTC: Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000,
      lastRunStatus: null,
    };
    reports.unshift(newReport);
    return HttpResponse.json(newReport);
  }),

  http.put(`${MOCK_API_URL}/api/v1/report/:reportId`, async ({ request, params }) => {
    await delay();
    const report = (await request.json()) as UnsavedReportDto;
    const reportId = params.reportId ?? "";

    const existingReportIndex = reports.findIndex((r) => r.reportID === reportId);
    if (existingReportIndex === -1) {
      return HttpResponse.json({ error: "Report not found" }, { status: 404 });
    }

    reports[existingReportIndex] = {
      ...reports[existingReportIndex],
      ...report,
      reportName: report.name,
      startingFromDate: report.startingFromDate?.split("T")[0] ?? null,
      endingOnDate: report.endingOnDate?.split("T")[0] ?? null,
    };
    return HttpResponse.json(report);
  }),

  http.post(`${MOCK_API_URL}/api/v1/report/:reportId/email`, async () => {
    await delay();
    return HttpResponse.json();
  }),

  http.get(`${MOCK_API_URL}/api/v1/ref/country-and-state`, async () => {
    await delay();
    return HttpResponse.json(countries);
  }),

  http.get(`${MOCK_API_URL}/api/v1/user/current`, async () => {
    await delay();
    return HttpResponse.json({
      userID: 10319,
      userName: "SkyBitz-Engineering-Demo",
      email: "jane.doe@fleetlite.abc",
      userTypeName: "Admin",
      customerID: 8,
      firstName: "Jane",
      lastName: "Doe",
      preferredTimezone: "Europe/Madrid",
    });
  }),

  http.get(`${MOCK_API_URL}/api/v1/search/quick`, async ({ request }) => {
    await delay();
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    const filteredAssets = quickSearchAssets.filter((asset) => asset.custAssetID?.includes(keyword));
    return HttpResponse.json({
      assets: filteredAssets,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/filter`, async ({ request }) => {
    const body = (await request.json()) as GenericAssetPayloadDto;

    const landmarkIds = body?.filters?.geoInfoIDs ?? [];
    const ids = body?.filters?.assetIDs ?? [];
    const idleTime = body?.filters?.idleTimeHoursGtThan as number;
    const lastReported = body?.filters?.reportedWithinPastDays as number;

    const cargoStatuses = body?.filters?.cargoStatuses as string[];
    const motionStatuses = body?.filters?.motionStatuses as string[];
    const byTextSearch = body?.filters?.searchKeyword as string;

    const page = (body?.page as number) ?? 0;
    const size = (body?.size as number) ?? 50;

    const limit = size;
    const offset = (page - 1) * size;

    let filteredAssets = genericAssets;
    if (landmarkIds?.length) {
      filteredAssets = filteredAssets.filter(
        (asset) => !landmarkIds || landmarkIds?.length === 0 || landmarkIds?.includes(asset.landmarkID)
      );
    }
    if (ids?.length) {
      filteredAssets = filteredAssets.filter((asset) => !ids || ids?.length === 0 || ids?.includes(asset.assetID));
    }

    if (idleTime) {
      filteredAssets = filteredAssets.filter(
        (asset) => !idleTime || (asset.idleTimeHours !== null && asset.idleTimeHours > idleTime)
      );
    }

    if (lastReported) {
      filteredAssets = filteredAssets.filter(
        (asset) => !lastReported || asset.lastReportedTimeMillisUTC > Date.now() - lastReported * 24 * 60 * 60 * 1000
      );
    }

    if (cargoStatuses) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          !cargoStatuses ||
          cargoStatuses?.length === 0 ||
          cargoStatuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );
    }

    if (motionStatuses) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          !motionStatuses ||
          motionStatuses?.length === 0 ||
          motionStatuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );
    }

    if (byTextSearch) {
      filteredAssets = filteredAssets.filter((asset) => asset.custAssetID.includes(byTextSearch));
    }

    await delay();
    return HttpResponse.json({
      data: filteredAssets.slice(offset, offset + limit),
      totalRecords: filteredAssets.length,
      pageNumber: page + 1,
      pageSize: size,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/idle`, async ({ request }) => {
    const body = (await request.json()) as IdleAssetPayloadDto;

    const landmarkIds = body?.filters?.geoInfoIDs ?? [];
    const ids = body?.filters?.assetIDs ?? [];
    const idleTime = body?.filters?.idleTimeHoursGtThan as number;
    const lastReported = body?.filters?.reportedWithinPastDays as number;

    const cargoStatuses = body?.filters?.cargoStatuses as string[];
    const motionStatuses = body?.filters?.motionStatuses as string[];
    const byTextSearch = body?.filters?.searchKeyword as string;

    const page = (body?.page as number) ?? 0;
    const size = (body?.size as number) ?? 50;

    const limit = size;
    const offset = (page - 1) * size;

    let filteredAssets = idleAssets;
    if (landmarkIds?.length) {
      filteredAssets = filteredAssets.filter(
        (asset) => !landmarkIds || landmarkIds?.length === 0 || landmarkIds?.includes(asset.landmarkID)
      );
    }
    if (ids?.length) {
      filteredAssets = filteredAssets.filter((asset) => !ids || ids?.length === 0 || ids?.includes(asset.assetID));
    }

    if (idleTime) {
      filteredAssets = filteredAssets.filter((asset) => !idleTime || asset.idleTimeHours > idleTime);
    }

    if (lastReported) {
      filteredAssets = filteredAssets.filter(
        (asset) => !lastReported || asset.lastReportedTimeMillisUTC > Date.now() - lastReported * 24 * 60 * 60 * 1000
      );
    }

    if (cargoStatuses) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          !cargoStatuses ||
          cargoStatuses?.length === 0 ||
          cargoStatuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );
    }

    if (motionStatuses) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          !motionStatuses ||
          motionStatuses?.length === 0 ||
          motionStatuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );
    }

    if (byTextSearch) {
      filteredAssets = filteredAssets.filter((asset) => asset.custAssetID.includes(byTextSearch));
    }

    await delay();
    return HttpResponse.json({
      data: filteredAssets.slice(offset, offset + limit),
      totalRecords: filteredAssets.length,
      pageNumber: page + 1,
      pageSize: size,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/idle/aggregate`, async () => {
    await delay();
    const data: IdleAssetAggregateDto = {
      totalIdleAssets: Math.floor(Math.random() * 50) + 1,
      distribution: {
        withEmptyCargo: Math.floor(Math.random() * 50) + 1,
        withPartiallyLoadedCargo: Math.floor(Math.random() * 50) + 1,
        withLoadedCargo: Math.floor(Math.random() * 50) + 1,
        withOtherCargoStatus: Math.floor(Math.random() * 50) + 1,
      },
    };
    return HttpResponse.json(data);
  }),

  http.post(`${MOCK_API_URL}/api/v1/landmark/batch`, async ({ request }) => {
    const body = (await request.json()) as LandmarkPayloadDto;
    const landmarkIds = body?.id ?? [];
    const foundLendmarks: LandmarkDto[] = landmarks
      .filter((landmark) => landmarkIds.includes(landmark.id))
      .map((landmark) => {
        return {
          id: landmark.id,
          name: landmark.name,
        };
      });
    return HttpResponse.json(foundLendmarks);
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/yard-check/aggregate`, async () => {
    await delay();
    const data: YardCheckAssetAggregateDto = {
      totalEmptyAssets: Math.floor(Math.random() * 50) + 1,
      yards: 2,
      yardDetails: [
        {
          landmarkID: 1,
          landmarkName: "Skybitz Distro 1",
          totalAssetsCount: Math.floor(Math.random() * 50) + 1,
          emptyAssetsCount: Math.floor(Math.random() * 50) + 1,
          lat: 37.8,
          longt: -122.4,
        },
        {
          landmarkID: 2,
          landmarkName: "Skybitz Distro 2",
          totalAssetsCount: Math.floor(Math.random() * 50) + 1,
          emptyAssetsCount: Math.floor(Math.random() * 50) + 1,
          lat: 37.775,
          longt: -122.41,
        },
      ],
    };
    return HttpResponse.json(data);
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/moving/aggregate`, async () => {
    await delay();
    const data: MovingAssetAggregateDto = {
      totalMovingAssets: Math.floor(Math.random() * 50) + 1,
      distribution: {
        withEmptyCargo: Math.floor(Math.random() * 50) + 1,
        withPartiallyLoadedCargo: Math.floor(Math.random() * 50) + 1,
        withLoadedCargo: Math.floor(Math.random() * 50) + 1,
        withOtherCargoStatus: Math.floor(Math.random() * 50) + 1,
      },
    };
    return HttpResponse.json(data);
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/moving`, async ({ request }) => {
    const body = (await request.json()) as IdleAssetPayloadDto;

    const landmarkIds = body?.filters?.geoInfoIDs ?? [];
    const ids = body?.filters?.assetIDs ?? [];
    const idleTime = body?.filters?.idleTimeHoursGtThan as number;
    const lastReported = body?.filters?.reportedWithinPastDays as number;

    const cargoStatuses = body?.filters?.cargoStatuses as string[];
    const motionStatuses = body?.filters?.motionStatuses as string[];
    const byTextSearch = body?.filters?.searchKeyword as string;

    const page = (body?.page as number) ?? 0;
    const size = (body?.size as number) ?? 50;

    const limit = size;
    const offset = (page - 1) * size;

    let filteredAssets = idleAssets;
    if (landmarkIds?.length) {
      filteredAssets = filteredAssets.filter(
        (asset) => !landmarkIds || landmarkIds?.length === 0 || landmarkIds?.includes(asset.landmarkID)
      );
    }
    if (ids?.length) {
      filteredAssets = filteredAssets.filter((asset) => !ids || ids?.length === 0 || ids?.includes(asset.assetID));
    }

    if (idleTime) {
      filteredAssets = filteredAssets.filter((asset) => !idleTime || asset.idleTimeHours > idleTime);
    }

    if (lastReported) {
      filteredAssets = filteredAssets.filter(
        (asset) => !lastReported || asset.lastReportedTimeMillisUTC > Date.now() - lastReported * 24 * 60 * 60 * 1000
      );
    }

    if (cargoStatuses) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          !cargoStatuses ||
          cargoStatuses?.length === 0 ||
          cargoStatuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );
    }

    if (motionStatuses) {
      filteredAssets = filteredAssets.filter(
        (asset) =>
          !motionStatuses ||
          motionStatuses?.length === 0 ||
          motionStatuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );
    }

    if (byTextSearch) {
      filteredAssets = filteredAssets.filter((asset) => asset.custAssetID.includes(byTextSearch));
    }

    await delay();
    return HttpResponse.json({
      data: filteredAssets.slice(offset, offset + limit),
      totalRecords: filteredAssets.length,
      pageNumber: page + 1,
      pageSize: size,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/yard-check/map`, async () => {
    // const body = (await request.json()) as YardCheckAssetPayloadDto;
    const points: YardCheckMapAssetDto[] = generateRandomLandmarkData(100, 100, 100);
    await delay();
    return HttpResponse.json(points);
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/yard-check-v2`, async ({ request }) => {
    const body = (await request.json()) as YardCheckAssetPayloadDto;

    const landmarkIds = body?.filters?.geoInfoIDs ?? [];
    const groups = body?.filters?.geoGrpIDs ?? [];
    const landmarkTypes = body?.filters?.geoTypeID ? [body.filters.geoTypeID] : [];
    const ids = body?.filters?.assetIDs ?? [];
    const types = body?.filters?.assetTypeID ? [body.filters.assetTypeID] : [];
    // const excludedAssetIds = (body?.excludedAssetIds as string[]).map(Number);
    const countries = body?.filters?.countryAbbreviation ? [body.filters.countryAbbreviation] : [];
    const state = body?.filters?.stateAbbreviation ? [body.filters.stateAbbreviation] : [];
    const zipCode = body?.filters?.zipCode as string;
    const idleTime = body?.filters?.idleTimeHoursGtThan as number;
    const lastReported = body?.filters?.reportedWithinPastDays as number;

    const statuses = body?.filters?.cargoStatuses as string[];

    const page = (body?.page as number) ?? 0;
    const size = (body?.size as number) ?? 50;

    const limit = size;
    const offset = (page - 1) * size;

    const filteredAssets = yardCheckAssets
      .filter((asset) => !landmarkIds || landmarkIds?.length === 0 || landmarkIds?.includes(asset.landmarkID))
      .filter(
        (asset) => !groups || groups?.length === 0 || (asset.landmarkGroupID && groups?.includes(asset.landmarkGroupID))
      )
      .filter(
        (asset) =>
          !landmarkTypes ||
          landmarkTypes.length === 0 ||
          (asset.landmarkTypeId && landmarkTypes?.includes(asset.landmarkTypeId))
      )
      .filter((asset) => !ids || ids?.length === 0 || ids?.includes(asset.assetID))
      .filter((asset) => !types || types?.length === 0 || (asset.typeId && types?.includes(asset.typeId)))
      // .filter((asset) => !excludedAssetIds?.includes(asset.assetID)) // TODO: review this with backend team
      .filter((asset) => !countries || countries?.length === 0 || (asset.country && countries?.includes(asset.country)))
      .filter(
        (asset) =>
          !state || state?.length === 0 || (asset.stateAbbreviation && state?.includes(asset.stateAbbreviation))
      )
      .filter((asset) => !zipCode || zipCode.length === 0 || asset.zipCode === zipCode)
      .filter((asset) => !idleTime || asset.idleTimeHours > idleTime)
      .filter(
        (asset) => !lastReported || asset.lastReportedTimeMillisUTC > Date.now() - lastReported * 24 * 60 * 60 * 1000
      )
      .filter(
        (asset) =>
          !statuses ||
          statuses?.length === 0 ||
          statuses?.every((status) =>
            asset.sensorData?.some((sensor) => sensor.sensorValue.toLowerCase().includes(status.toLowerCase()))
          )
      );

    await delay();
    return HttpResponse.json({
      data: filteredAssets.slice(offset, offset + limit),
      totalRecords: filteredAssets.length,
      pageNumber: page + 1,
      pageSize: size,
    });
  }),

  http.post(`${MOCK_API_URL}/api/v1/asset/batch`, async ({ request }) => {
    const body = (await request.json()) as AssetIdPayloadDto;
    const assetIds = body?.id ?? [];
    const assets: AssetIdDto[] = yardCheckAssets
      .filter((asset) => assetIds.includes(asset.assetID))
      .map((asset) => {
        return {
          id: asset.assetID,
          custAssetID: asset.custAssetID,
        };
      });
    return HttpResponse.json(assets);
  }),
  http.get(`${MOCK_API_URL}/api/v1/user/settings`, async ({ request }) => {
    console.log( "MERA DATA API" );
    await delay();
    return HttpResponse.json(expandedData);
  }),

  // http.post(`${MOCK_API_URL}/api/v1/user/settings` , async ({ request }) =>{
  //   const data = request.body;
  //   console.log( "MERA DATA" , data);
  //   expandedDataObj[data.group][data.name] = data.value;

  // })
];
