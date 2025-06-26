import { AccruedDistanceAssetDto, AssetTypeDto } from "@/infrastructure/repositories/asset/asset-dto";
import {
  YardCheckAssetDto,
  GenericAssetDto,
  IdleAssetDto,
  MovingAssetDto,
} from "@/infrastructure/repositories/asset/asset-dto";
import { LandmarkDto, LandmarkGroupDto, LandmarkTypeDto } from "@/infrastructure/repositories/landmark/landmark-dto";
import { ReportDto } from "@/infrastructure/repositories/report/report-dto";
import { SensorDto } from "@/infrastructure/repositories/sensor/sensor-dto";
import { generateTimeSlots } from "@/views/reports/utils/generate-time-slots";
import { QuickSearchDto } from "@/infrastructure/repositories/quick-search/quick-search-dto";

const sensorTypes: SensorType[] = ["CARGO", "CONTAINER", "DOOR", "POWER", "TAMPER", "MOTION", "VOLUMETRIC"];
const sensorValues: Record<SensorType, Sensor["status"][]> = {
  CARGO: ["LOADED", "BARE", "UNKNOWN", "MOUNTED", "PARTIALLY_LOADED", "EMPTY", "FULL", "DISABLED"],
  CONTAINER: ["BARE", "MOUNTED", "UNKNOWN", "DISABLED", "DISMOUNTED", "ERROR", "NO_ANSWER"],
  DOOR: ["OPEN", "CLOSED", "UNKNOWN"],
  POWER: ["ON_BATTERY", "POWER_OFF", "POWER_ON", "UNKNOWN"],
  TAMPER: ["DISARMED", "ALERT", "ARMED", "UNKNOWN"],
  MOTION: ["CLOSED", "IDLE", "MOVING", "START", "STOP", "NO_ANSWER", "UNKNOWN"],
  VOLUMETRIC: ["EMPTY", "PARTIALLY_LOADED", "LOADED", "UNKNOWN"],
};

const getRandomSensorValue = (): SensorDto => {
  const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
  return {
    sensorType,
    sensorValue: sensorValues[sensorType][Math.floor(Math.random() * sensorValues[sensorType].length)],
  } as SensorDto;
};

export const landmarks: LandmarkDto[] = Array.from({ length: 100 }).map((_, index) => ({
  id: index + 1,
  name: `SkyBitz Distro ${index + 1}`,
  typeId: 1 + Math.floor(Math.random() * 10),
  groupId: 1 + Math.floor(Math.random() * 10),
}));

export const landmarkGroups: LandmarkGroupDto[] = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  name: `LM Group ${index + 1}`,
}));

export const landmarkTypes: LandmarkTypeDto[] = Array.from({ length: 10 }).map((_, index) => ({
  geoTypeID: index + 1,
  name: `LM Type ${index + 1}`,
}));

export const assetTypes: AssetTypeDto[] = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  assetTypeName: `Asset Type ${index + 1}`,
}));

export const yardCheckAssets: YardCheckAssetDto[] = Array.from({ length: 50000 }, (_, index) => {
  const landmark = landmarks[Math.floor(Math.random() * 100)];
  const landmarkGroup = landmarkGroups[landmark.groupId! - 1];
  const landmarkType = landmarkTypes[landmark.typeId! - 1];

  const lastReportedTime = Date.now() - Math.random() * 35 * 24 * 60 * 60 * 1000;

  return {
    assetID: index + 1,
    custAssetID: `5000000${index + 1}`,
    mtsn: Math.floor(Math.random() * 1000000).toString(),
    arrivedAtLandmarkMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    lastReportedTimeMillisUTC: lastReportedTime,
    idleTimeHours: 1.15 + Math.random() * 35 * 24,
    landmarkName: landmark.name,
    landmarkID: landmark.id,
    landmarkGroupName: landmarkGroup.name,
    landmarkGroupID: landmarkGroup.id,
    sensorData: Array.from({ length: 5 }).map(() => getRandomSensorValue()),
    landmarkTypeId: landmarkType.geoTypeID,
    typeId: 1 + Math.floor(Math.random() * 10),
    country: Math.random() < 0.8 ? "US" : Math.random() < 0.7 ? "CA" : "MX",
    stateAbbreviation: Math.random() < 0.5 ? "TX" : "NY",
    zipCode: Math.floor(Math.random() * 1000).toString(),
    assetType: "Trailer",
  };
});

export const accruedDistanceAssets: AccruedDistanceAssetDto[] = Array.from({ length: 50000 }, (_, index) => {
  const landmark = landmarks[Math.floor(Math.random() * 100)];

  return {
    assetID: index + 1,
    custAssetID: `5000000${index + 1}`,
    accruedDistanceInMiles: Math.random() * 1000,
    assetType: `Type ${1 + Math.floor(Math.random() * 10)}`,
    mtsn: `${Math.floor(Math.random() * 1000000)}`,
    deviceInstalledOnMilliUTC: Date.now() - Math.random() * 7 * 365 * 24 * 60 * 60 * 1000,
    lastLandmarkID: landmark.id,
    lastLandmark: landmark.name,
    lastReportedAtMillisUTC: Date.now() - Math.random() * 28 * 24 * 60 * 60 * 1000,
  };
});

const sensorsMap = {
  CARGO: ["LOADED", "MOUNTED", "PARTIALLY_LOADED", "BARE", "EMPTY", "FULL", "UNKNOWN", "DISABLED"],
  CONTAINER: ["DISABLED", "BARE", "DISMOUNTED", "ERROR", "MOUNTED", "NO_ANSWER", "UNKNOWN"],
  DOOR: ["OPEN", "CLOSED", "UNKNOWN"],
  POWER: ["ON_BATTERY", "POWER_OFF", "POWER_ON", "UNKNOWN"],
  TAMPER: ["DISARMED", "ALERT", "ARMED", "UNKNOWN"],
  MOTION: ["CLOSED", "IDLE", "MOVING", "START", "STOP", "NO_ANSWER", "UNKNOWN"],
};

export const sensors: SensorDto[] = Array.from({ length: 128 }, () => {
  const sensorType = (Object.keys(sensorsMap) as (keyof typeof sensorsMap)[])[
    Math.floor(Math.random() * Object.keys(sensorsMap).length)
  ];

  const sensorValue = sensorsMap[sensorType][Math.floor(Math.random() * sensorsMap[sensorType].length)];

  return {
    sensorType,
    sensorValue,
  } as SensorDto;
});

export const reports: ReportDto[] = Array.from({ length: 50 }, () => {
  const landmark = landmarks[Math.floor(Math.random() * 100)];

  const recurType = ["ONCE", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"][Math.floor(Math.random() * 3)] as
    | "ONCE"
    | "HOURLY"
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY";

  const reportType = ["YARD_CHECK", "ACCRUED_DISTANCE"][Math.floor(Math.random() * 2)] as
    | "YARD_CHECK"
    | "ACCRUED_DISTANCE";

  const sortOptions = ["ASC", "DESC"] as const;

  const randomDate = () => new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

  const isRepeatable = recurType !== "ONCE";

  // For one-time reports, we want to show reports that have run and reports that will run
  const hasRun = Math.random() < 0.5;
  const lastRunFinishedOnMilliUTC =
    isRepeatable || hasRun ? Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000 : null;
  return {
    reportID: `REPORT_${(Math.random() * 9000).toFixed(0)}`,
    reportName: `Report ${(Math.random() * 9000).toFixed(0)}`,
    reportType,
    recurType,
    createdOnMilliUTC: Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
    lastRunFinishedOnMilliUTC: lastRunFinishedOnMilliUTC,
    nextRunScheduledOnMilliUTC: isRepeatable || !hasRun ? Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000 : null,
    timeZoneFullName: [
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "America/Toronto",
      "America/Mexico_City",
    ][Math.floor(Math.random() * 5)],
    isRepeatable,
    recipients: Array.from(
      { length: Math.floor(Math.random() * 10) },
      () => `Recipient ${(Math.random() * 9000).toFixed(0)}`
    ),
    runAt: generateTimeSlots()[Math.floor(Math.random() * generateTimeSlots().length)].id,
    recurEveryNthTimes: Math.floor(Math.random() * 10) + 1,
    startingFromDate: randomDate().toISOString().split("T")[0],
    endingOnDate: randomDate().toISOString().split("T")[0],
    hourlyConfig: recurType === "HOURLY" ? { intervalHours: 1 + Math.floor(Math.random() * 23) } : null,
    dailyConfig: recurType === "DAILY" ? { intervalDays: 1 + Math.floor(Math.random() * 30) } : null,
    weeklyConfig:
      recurType === "WEEKLY"
        ? {
            intervalWeeks: 1 + Math.floor(Math.random() * 4),
            daysOfWeek: Array.from(
              { length: Math.max(1, Math.floor(Math.random() * 3)) },
              () => 1 + Math.floor(Math.random() * 7)
            ),
          }
        : null,
    monthlyConfig:
      recurType === "MONTHLY"
        ? {
            intervalMonths: Math.floor(Math.random() * 11) + 1,
            nthOccurrence: Math.floor(Math.random() * 30) + 1,
            nthOccurrenceDayOfWeek: Math.floor(Math.random() * 6) + 1,
          }
        : null,
    yearlyConfig:
      recurType === "YEARLY"
        ? {
            intervalYears: Math.floor(Math.random() * 99) + 1,
            nthOccurrence: Math.floor(Math.random() * 5) + 1,
            nthOccurrenceDayOfWeek: Math.floor(Math.random() * 7) + 1,
            months: Array.from(
              new Set(
                Array.from(
                  { length: Math.max(1, Math.floor(Math.random() * 6)) },
                  () => 1 + Math.floor(Math.random() * 12)
                )
              )
            ),
          }
        : null,
    yardCheckFilter:
      reportType === "YARD_CHECK"
        ? {
            geoTypeID: landmark.typeId ?? null,
            geoInfoIDs: landmark.id ? [landmark.id] : null,
            geoGrpIDs: landmark.groupId ? [landmark.groupId] : null,
            assetIDs: Array.from({ length: Math.floor(Math.random() * 10) }, () => 1 + Math.floor(Math.random() * 100)),
            assetTypeID: 1 + Math.floor(Math.random() * 10) || null,
            countryAbbreviation: "US",
            stateAbbreviation: null,
            zipCode: null,
            cargoStatuses: null,
            idleTimeHours: [4, 12, 24, 168, 720][Math.floor(Math.random() * 5)],
            reportedWithinPastDays: [7, 14, 21, 30][Math.floor(Math.random() * 4)],
            sort: [
              {
                field: "idleTimeHours",
                order: sortOptions[Math.floor(Math.random() * sortOptions.length)],
              },
            ],
          }
        : null,
    accruedDistanceFilter:
      reportType === "ACCRUED_DISTANCE"
        ? {
            dateRange: {
              from: randomDate().toISOString().split("T")[0],
              to: randomDate().toISOString().split("T")[0],
            },
            assetIDs: Array.from(
              { length: Math.floor(3 + Math.random() * 7) },
              () => 1 + Math.floor(Math.random() * 99)
            ),
            sort: [
              {
                field: [
                  "assetID",
                  "custAssetID",
                  "accruedDistanceInMiles",
                  "assetType",
                  "mtsn",
                  "deviceInstalledOnMilliUTC",
                  "lastLandmarkID",
                  "lastReportedAtMillisUTC",
                ][Math.floor(Math.random() * 8)],
                order: sortOptions[Math.floor(Math.random() * sortOptions.length)],
              },
            ],
          }
        : null,
    lastRunStatus: lastRunFinishedOnMilliUTC ? "COMPLETED" : "IN_PROGRESS",
  };
});

export const quickSearchAssets: QuickSearchDto[] = Array.from({ length: 20 }).map((_, index) => ({
  id: index + 1,
  custAssetID: `3000000${index + 1}`,
  type: `Dry Van ${index + 1}`,
  mtsn: `GXL1HLAG19301964${index + 1}`,
  mtid: index + 100,
}));

export const genericAssets: GenericAssetDto[] = Array.from({ length: 50000 }, (_, index) => {
  const landmark = landmarks[Math.floor(Math.random() * 100)];

  const lastReportedTime = Date.now() - Math.random() * 35 * 24 * 60 * 60 * 1000;
  const assetGeoType = ["POI", "GENERIC", "CUSTOM"][Math.floor(Math.random() * 3)] as AssetGeoType;
  const assetDirection = ["S", "SW", "W", "NW", "N", "NE", "E", "SE", null][
    Math.floor(Math.random() * 9)
  ] as AssetDirection;
  return {
    assetID: index + 1,
    custAssetID: `3000000${index + 1}`,
    assetType: "Trailer",
    mtsn: Math.floor(Math.random() * 1000000).toString(),
    arrivedAtLandmarkMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    idleTimeHours: 1.15 + Math.random() * 35 * 24,
    startedMovingFromMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    movingDurationMinutes: 1.15 + Math.random() * 35 * 24,
    landmarkName: landmark.name,
    landmarkID: landmark.id,
    sensorData: Array.from({ length: 5 }).map(() => getRandomSensorValue()),
    lastReportedTimeMillisUTC: lastReportedTime,
    geoClass: assetGeoType,
    direction: assetDirection,
    city: "Sunnyvale",
    stateAbbr: "California",
    zip: "391350",
    distanceFromLandmarkMiles: 2.16847915693,
  };
});

export const idleAssets: IdleAssetDto[] = Array.from({ length: 50000 }, (_, index) => {
  const landmark = landmarks[Math.floor(Math.random() * 100)];

  const lastReportedTime = Date.now() - Math.random() * 35 * 24 * 60 * 60 * 1000;
  const assetGeoType = ["POI", "GENERIC", "CUSTOM"][Math.floor(Math.random() * 3)] as AssetGeoType;
  const assetDirection = ["S", "SW", "W", "NW", "N", "NE", "E", "SE", null][
    Math.floor(Math.random() * 9)
  ] as AssetDirection;
  return {
    assetID: index + 1,
    custAssetID: `3000000${index + 1}`,
    assetType: "Trailer",
    mtsn: Math.floor(Math.random() * 1000000).toString(),
    arrivedAtLandmarkMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    idleTimeHours: 1.15 + Math.random() * 35 * 24,
    startedMovingFromMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    movingDurationMinutes: 1.15 + Math.random() * 35 * 24,
    landmarkName: landmark.name,
    landmarkID: landmark.id,
    sensorData: Array.from({ length: 5 }).map(() => getRandomSensorValue()),
    lastReportedTimeMillisUTC: lastReportedTime,
    geoClass: assetGeoType,
    direction: assetDirection,
    city: "Sunnyvale",
    stateAbbr: "California",
    zip: "391350",
    distanceFromLandmarkMiles: 2.16847915693,
  };
});

export const movingAssets: MovingAssetDto[] = Array.from({ length: 50000 }, (_, index) => {
  const landmark = landmarks[Math.floor(Math.random() * 100)];

  const lastReportedTime = Date.now() - Math.random() * 35 * 24 * 60 * 60 * 1000;
  const assetGeoType = ["POI", "GENERIC", "CUSTOM"][Math.floor(Math.random() * 3)] as AssetGeoType;
  const assetDirection = ["S", "SW", "W", "NW", "N", "NE", "E", "SE", null][
    Math.floor(Math.random() * 9)
  ] as AssetDirection;
  return {
    assetID: index + 1,
    custAssetID: `3000000${index + 1}`,
    assetType: "Trailer",
    mtsn: Math.floor(Math.random() * 1000000).toString(),
    arrivedAtLandmarkMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    startedMovingFromMillisUTC: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    movingDurationMinutes: lastReportedTime - Math.random() * 24 * 60 * 60 * 1000,
    landmarkName: landmark.name,
    landmarkID: landmark.id,
    sensorData: Array.from({ length: 5 }).map(() => getRandomSensorValue()),
    lastReportedTimeMillisUTC: lastReportedTime,
    geoClass: assetGeoType,
    direction: assetDirection,
    city: "Sunnyvale",
    stateAbbr: "California",
    zip: "391350",
    distanceFromLandmarkMiles: 2.16847915693,
  };
});

export function generateRandomLandmarkData(numLandmarks = 1, maxPolygons = 2, maxAssets = 2) {
  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
  const generateCustAssetID = () => Math.floor(1000 + Math.random() * 9000).toString();
  const landmarks = [];

  for (let i = 0; i < numLandmarks; i++) {
    const numPolygons = Math.floor(randomInRange(1, maxPolygons + 1));
    const numAssets = Math.floor(randomInRange(1, maxAssets + 1));
    const polygons = [];
    for (let j = 0; j < numPolygons; j++) {
      polygons.push({
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        longt: -74.006 + (Math.random() - 0.5) * 0.1,
      });
    }
    const assets = [];
    for (let k = 0; k < numAssets; k++) {
      assets.push({
        custAssetID: generateCustAssetID(),
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        longt: -74.006 + (Math.random() - 0.5) * 0.1,
        idleTimeHours: Math.floor(randomInRange(0, 100)),
      });
    }
    landmarks.push({
      landmarkID: i + 1,
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      longt: -74.006 + (Math.random() - 0.5) * 0.1,
      polygons: polygons,
      assets: assets,
    });
  }
  return landmarks;
}



type GroupExpansionEntry = {
  group: "yard-check" | "accrued-distance" | "generic-assets" | "idle-assets" | "moving-assets";
  expansion: Record<string,boolean>[];
};

export const expandedData: GroupExpansionEntry[] = [
  {
    group: "yard-check",
    expansion: [{ asset: false }, { sensor: false }, { operational: false }, { location: true }, { landmark: false }]
  },
  {
    group: "accrued-distance",
    expansion: [{ asset: false }, { sensor: false }, { operational: false }, { location: true }, { landmark: false }]
  },
  {
    group: "generic-assets",
    expansion: [{ asset: false }, { sensor: false }, { operational: false }, { location: true }, { landmark: false }]
  },
  {
    group: "idle-assets",
    expansion: [{ asset: false }, { sensor: false }, { operational: false }, { location: true }, { landmark: false }]
  },
  {
    group: "moving-assets",
   expansion: [{ asset: false }, { sensor: false }, { operational: false }, { location: true }, { landmark: false }]
  },
];
