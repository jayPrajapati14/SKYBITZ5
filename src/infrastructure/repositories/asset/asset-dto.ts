import { z } from "zod";
import { SensorDtoSchema } from "../sensor/sensor-dto";
import { LandmarkAssetStatsDtoSchema } from "../landmark/landmark-dto";

const location = ["AT_LANDMARK", "NOT_AT_LANDMARK", "ANYWHERE"] as const;
const geoType = ["POI", "GENERIC", "CUSTOM"] as const;
const direction = ["S", "SW", "W", "NW", "N", "NE", "E", "SE"] as const;

export const AssetTypeDtoSchema = z
  .object({
    id: z.number(),
    assetTypeName: z.string(),
  })
  .describe("AssetTypeDto");

export const AssetIdDtoSchema = z
  .object({
    id: z.number(),
    custAssetID: z.string(),
  })
  .describe("AssetIdDto");

export const YardCheckAssetDtoSchema = z
  .object({
    assetID: z.number(),
    custAssetID: z.string(),
    mtsn: z.string(),
    arrivedAtLandmarkMillisUTC: z.number(),
    lastReportedTimeMillisUTC: z.number(),
    idleTimeHours: z.number(),
    landmarkName: z.string(),
    landmarkID: z.number(),
    landmarkGroupName: z.string().optional(),
    landmarkGroupID: z.number().optional(),
    sensorData: z.array(SensorDtoSchema).nullable(),
    // Not part of this response, but useful for the UI filtering
    landmarkTypeId: z.number().optional(),
    typeId: z.number().optional(),
    country: z.string().optional(),
    stateAbbreviation: z.string().optional(),
    zipCode: z.string().optional(),
    assetType: z.string().optional(),
  })
  .describe("YardCheckAssetDto");

export const AccruedDistanceAssetDtoSchema = z
  .object({
    assetID: z.number(),
    custAssetID: z.string(),
    accruedDistanceInMiles: z.number(),
    assetType: z.string(),
    mtsn: z.string(),
    deviceInstalledOnMilliUTC: z.number().nullable(),
    lastLandmark: z.string().nullable(),
    lastLandmarkID: z.number().nullable(),
    lastReportedAtMillisUTC: z.number(),
  })
  .describe("AccruedDistanceAssetDto");

export const SortingSchema = z.object({
  field: z.string(),
  order: z.enum(["ASC", "DESC"]),
});

export const YardCheckAssetPayloadSchema = z.object({
  page: z.number(),
  size: z.number(),
  filters: z.object({
    geoTypeID: z.number().nullable(),
    geoInfoIDs: z.array(z.number()).nullable(),
    geoGrpIDs: z.array(z.number()).nullable(),
    assetIDs: z.array(z.number()).nullable(),
    assetTypeID: z.number().nullable(),
    countryAbbreviation: z.string().nullable(),
    stateAbbreviation: z.string().nullable(),
    zipCode: z.string().nullable(),
    cargoStatuses: z.array(z.string()).nullable(),
    motionStatuses: z.array(z.string()).nullable(),
    idleTimeHoursGtThan: z.number().nullable(),
    reportedWithinPastDays: z.number().optional(),
    sort: z.array(SortingSchema),
    searchKeyword: z.string().nullable(),
    volumetricStatuses: z.array(z.string()).nullable(),
  }),
});

export const AccruedDistancePayloadSchema = z.object({
  page: z.number(),
  size: z.number(),
  filters: z.object({
    assetIDs: z.array(z.number()).nullable(),
    fromMillisUTC: z.number().nullable(),
    toMillisUTC: z.number().nullable(),
    accruedDistanceSortInDescending: z.boolean().optional(),
    sort: z.array(SortingSchema).optional(),
  }),
});

export const PaginatedResponseSchema = z.object({
  totalRecords: z.number(),
  pageNumber: z.number(),
  pageSize: z.number(),
});

export const YardCheckPaginatedResponseSchema = PaginatedResponseSchema.extend({
  data: z.array(YardCheckAssetDtoSchema),
});

export const AccruedDistancePaginatedResponseSchema = PaginatedResponseSchema.extend({
  data: z.array(AccruedDistanceAssetDtoSchema),
});

export const GenericAssetDtoSchema = z
  .object({
    assetID: z.number(),
    custAssetID: z.string(),
    mtsn: z.string(),
    assetType: z.string().nullable(),
    arrivedAtLandmarkMillisUTC: z.number().nullable(),
    idleTimeHours: z.number().nullable(),
    startedMovingFromMillisUTC: z.number().nullable(),
    movingDurationMinutes: z.number().nullable(),
    landmarkName: z.string(),
    landmarkID: z.number(),
    sensorData: z.array(SensorDtoSchema).nullable(),
    lastReportedTimeMillisUTC: z.number(),
    geoClass: z.enum(geoType),
    direction: z.enum(direction).nullable().optional(),
    distanceFromLandmarkMiles: z.number().nullable().optional(),
    city: z.string().nullable().optional(),
    stateAbbr: z.string().nullable().optional(),
    zip: z.string().nullable().optional(),
  })
  .describe("GenericAssetsDto");

export const GenericAssetPaginatedResponseSchema = PaginatedResponseSchema.extend({
  data: z.array(GenericAssetDtoSchema),
});

export const GenericAssetPayloadSchema = z.object({
  page: z.number(),
  size: z.number(),
  filters: z.object({
    geoTypeID: z.number().nullable(),
    geoInfoIDs: z.array(z.number()).nullable(),
    geoGrpIDs: z.array(z.number()).nullable(),
    assetIDs: z.array(z.number()).nullable(),
    assetTypeID: z.number().nullable(),
    countryAbbreviation: z.string().nullable(),
    stateAbbreviation: z.string().nullable(),
    zipCode: z.string().nullable(),
    cargoStatuses: z.array(z.string()).nullable(),
    idleTimeHoursGtThan: z.number().nullable(),
    reportedWithinPastDays: z.number().optional(),
    sort: z.array(SortingSchema),
    searchKeyword: z.string().nullable(),
    motionStatuses: z.array(z.string()).nullable(),
    assetLocationType: z.enum(location),
    volumetricStatuses: z.array(z.string()).nullable(),
  }),
});

export const IdleAssetDtoSchema = z
  .object({
    assetID: z.number(),
    custAssetID: z.string(),
    mtsn: z.string(),
    assetType: z.string().nullable(),
    arrivedAtLandmarkMillisUTC: z.number(),
    idleTimeHours: z.number(),
    startedMovingFromMillisUTC: z.number().nullable(),
    movingDurationMinutes: z.number().nullable(),
    landmarkName: z.string(),
    landmarkID: z.number(),
    sensorData: z.array(SensorDtoSchema).nullable(),
    lastReportedTimeMillisUTC: z.number(),
    geoClass: z.enum(geoType),
    direction: z.enum(direction).nullable().optional(),
    distanceFromLandmarkMiles: z.number().nullable().optional(),
    city: z.string().nullable().optional(),
    stateAbbr: z.string().nullable().optional(),
    zip: z.string().nullable().optional(),
  })
  .describe("IdleAssetsDto");

export const IdleAssetPayloadSchema = z.object({
  page: z.number(),
  size: z.number(),
  filters: z.object({
    geoTypeID: z.number().nullable(),
    geoInfoIDs: z.array(z.number()).nullable(),
    geoGrpIDs: z.array(z.number()).nullable(),
    assetIDs: z.array(z.number()).nullable(),
    assetTypeID: z.number().nullable(),
    countryAbbreviation: z.string().nullable(),
    stateAbbreviation: z.string().nullable(),
    zipCode: z.string().nullable(),
    cargoStatuses: z.array(z.string()).nullable(),
    idleTimeHoursGtThan: z.number().nullable(),
    reportedWithinPastDays: z.number().optional(),
    sort: z.array(SortingSchema),
    searchKeyword: z.string().nullable(),
    motionStatuses: z.array(z.string()).nullable(),
    assetLocationType: z.enum(location),
    volumetricStatuses: z.array(z.string()).nullable(),
  }),
});

export const IdleAssetPaginatedResponseSchema = PaginatedResponseSchema.extend({
  data: z.array(IdleAssetDtoSchema),
});

export const IdleAssetAggregateDtoSchema = z
  .object({
    totalIdleAssets: z.number(),
    distribution: z.object({
      withEmptyCargo: z.number(),
      withPartiallyLoadedCargo: z.number(),
      withLoadedCargo: z.number(),
      withOtherCargoStatus: z.number(),
    }),
  })
  .describe("IdleAssetAggregateDto");

export const IdleAssetAggregatePayloadSchema = z.object({
  geoTypeID: z.number().nullable(),
  geoInfoIDs: z.array(z.number()).nullable(),
  geoGrpIDs: z.array(z.number()).nullable(),
  assetIDs: z.array(z.number()).nullable(),
  assetTypeID: z.number().nullable(),
  countryAbbreviation: z.string().nullable(),
  stateAbbreviation: z.string().nullable(),
  zipCode: z.string().nullable(),
  cargoStatuses: z.array(z.string()).nullable(),
  idleTimeHoursGtThan: z.number().nullable(),
  reportedWithinPastDays: z.number().optional(),
  sort: z.array(SortingSchema),
  searchKeyword: z.string().nullable(),
  motionStatuses: z.array(z.string()).nullable(),
  assetLocationType: z.enum(location),
  volumetricStatuses: z.array(z.string()).nullable(),
});

export const YardCheckAssetAggregateDtoSchema = z
  .object({
    totalEmptyAssets: z.number(),
    yards: z.number(),
    yardDetails: z.array(LandmarkAssetStatsDtoSchema),
  })
  .describe("IdleAssetAggregateDto");

export const YardCheckAssetAggregatePayloadSchema = z.object({
  geoTypeID: z.number().nullable(),
  geoInfoIDs: z.array(z.number()).nullable(),
  geoGrpIDs: z.array(z.number()).nullable(),
  assetIDs: z.array(z.number()).nullable(),
  assetTypeID: z.number().nullable(),
  countryAbbreviation: z.string().nullable(),
  stateAbbreviation: z.string().nullable(),
  zipCode: z.string().nullable(),
  cargoStatuses: z.array(z.string()).nullable(),
  idleTimeHoursGtThan: z.number().nullable(),
  reportedWithinPastDays: z.number().optional(),
  sort: z.array(SortingSchema),
  searchKeyword: z.string().nullable(),
  motionStatuses: z.array(z.string()).nullable(),
  volumetricStatuses: z.array(z.string()).nullable(),
});

export const MovingAssetDtoSchema = z
  .object({
    assetID: z.number(),
    custAssetID: z.string(),
    mtsn: z.string(),
    assetType: z.string().nullable(),
    arrivedAtLandmarkMillisUTC: z.number().nullable(),
    startedMovingFromMillisUTC: z.number().nullable(),
    movingDurationMinutes: z.number().nullable(),
    landmarkName: z.string(),
    landmarkID: z.number(),
    sensorData: z.array(SensorDtoSchema).nullable(),
    lastReportedTimeMillisUTC: z.number(),
    geoClass: z.enum(geoType),
    direction: z.enum(direction).nullable().optional(),
    distanceFromLandmarkMiles: z.number().nullable().optional(),
    city: z.string().nullable().optional(),
    stateAbbr: z.string().nullable().optional(),
    zip: z.string().nullable().optional(),
  })
  .describe("MovingAssetsDto");

export const MovingAssetPayloadSchema = z.object({
  page: z.number(),
  size: z.number(),
  filters: z.object({
    geoTypeID: z.number().nullable(),
    geoInfoIDs: z.array(z.number()).nullable(),
    geoGrpIDs: z.array(z.number()).nullable(),
    assetIDs: z.array(z.number()).nullable(),
    assetTypeID: z.number().nullable(),
    countryAbbreviation: z.string().nullable(),
    stateAbbreviation: z.string().nullable(),
    zipCode: z.string().nullable(),
    cargoStatuses: z.array(z.string()).nullable(),
    reportedWithinPastDays: z.number().optional(),
    sort: z.array(SortingSchema),
    searchKeyword: z.string().nullable(),
    motionStatuses: z.array(z.string()).nullable(),
    assetLocationType: z.enum(location),
    volumetricStatuses: z.array(z.string()).nullable(),
  }),
});

export const MovingAssetPaginatedResponseSchema = PaginatedResponseSchema.extend({
  data: z.array(MovingAssetDtoSchema),
});

export const MovingAssetAggregateDtoSchema = z
  .object({
    totalMovingAssets: z.number(),
    distribution: z.object({
      withEmptyCargo: z.number(),
      withPartiallyLoadedCargo: z.number(),
      withLoadedCargo: z.number(),
      withOtherCargoStatus: z.number(),
    }),
  })
  .describe("MovingAssetAggregateDto");

export const MovingAssetAggregatePayloadSchema = z.object({
  geoTypeID: z.number().nullable(),
  geoInfoIDs: z.array(z.number()).nullable(),
  geoGrpIDs: z.array(z.number()).nullable(),
  assetIDs: z.array(z.number()).nullable(),
  assetTypeID: z.number().nullable(),
  countryAbbreviation: z.string().nullable(),
  stateAbbreviation: z.string().nullable(),
  zipCode: z.string().nullable(),
  cargoStatuses: z.array(z.string()).nullable(),
  reportedWithinPastDays: z.number().optional(),
  sort: z.array(SortingSchema),
  searchKeyword: z.string().nullable(),
  motionStatuses: z.array(z.string()).nullable(),
  assetLocationType: z.enum(location),
  volumetricStatuses: z.array(z.string()).nullable(),
});

export const YardCheckMapAssetDtoSchema = z
  .object({
    landmarkID: z.number(),
    lat: z.number(),
    longt: z.number(),
    polygons: z
      .array(
        z.object({
          lat: z.number(),
          longt: z.number(),
        })
      )
      .nullable(),
    assets: z
      .array(
        z.object({
          custAssetID: z.string(),
          lat: z.number().nullable(),
          longt: z.number().nullable(),
          idleTimeHours: z.number(),
        })
      )
      .nullable(),
  })
  .describe("YardCheckMapAssetDto");

export const YardCheckMapAssetResponseDtoSchema = z
  .array(YardCheckMapAssetDtoSchema)
  .describe("YardCheckMapAssetResponseDto");

export const YardCheckMapAssetPayloadSchema = z.object({
  geoTypeID: z.number().nullable(),
  geoInfoIDs: z.array(z.number()).nullable(),
  geoGrpIDs: z.array(z.number()).nullable(),
  assetIDs: z.array(z.number()).nullable(),
  assetTypeID: z.number().nullable(),
  countryAbbreviation: z.string().nullable(),
  stateAbbreviation: z.string().nullable(),
  zipCode: z.string().nullable(),
  cargoStatuses: z.array(z.string()).nullable(),
  motionStatuses: z.array(z.string()).nullable(),
  idleTimeHoursGtThan: z.number().nullable(),
  reportedWithinPastDays: z.number().optional(),
  searchKeyword: z.string().nullable(),
  volumetricStatuses: z.array(z.string()).nullable(),
});

export const AssetIdsPayloadSchema = z.object({
  id: z.array(z.number()),
});

export type AssetIdDto = z.infer<typeof AssetIdDtoSchema>;
export type AssetTypeDto = z.infer<typeof AssetTypeDtoSchema>;
export type YardCheckAssetDto = z.infer<typeof YardCheckAssetDtoSchema>;
export type GenericAssetDto = z.infer<typeof GenericAssetDtoSchema>;
export type AccruedDistanceAssetDto = z.infer<typeof AccruedDistanceAssetDtoSchema>;
export type YardCheckAssetPayloadDto = z.infer<typeof YardCheckAssetPayloadSchema>;
export type GenericAssetPayloadDto = z.infer<typeof GenericAssetPayloadSchema>;
export type AccruedDistancePayloadDto = z.infer<typeof AccruedDistancePayloadSchema>;
export type SortingDto = z.infer<typeof SortingSchema>;
export type YardCheckPaginatedResponseDto = z.infer<typeof YardCheckPaginatedResponseSchema>;
export type GenericAssetPaginatedResponseDto = z.infer<typeof GenericAssetPaginatedResponseSchema>;
export type AccruedDistancePaginatedResponseDto = z.infer<typeof AccruedDistancePaginatedResponseSchema>;
export type IdleAssetDto = z.infer<typeof IdleAssetDtoSchema>;
export type IdleAssetPayloadDto = z.infer<typeof IdleAssetPayloadSchema>;
export type IdleAssetPaginatedResponseDto = z.infer<typeof IdleAssetPaginatedResponseSchema>;
export type IdleAssetAggregateDto = z.infer<typeof IdleAssetAggregateDtoSchema>;
export type IdleAssetAggregatePayloadDto = z.infer<typeof IdleAssetAggregatePayloadSchema>;
export type YardCheckAssetAggregateDto = z.infer<typeof YardCheckAssetAggregateDtoSchema>;
export type YardCheckAssetAggregatePayloadDto = z.infer<typeof YardCheckAssetAggregatePayloadSchema>;
export type MovingAssetDto = z.infer<typeof MovingAssetDtoSchema>;
export type MovingAssetPayloadDto = z.infer<typeof MovingAssetPayloadSchema>;
export type MovingAssetPaginatedResponseDto = z.infer<typeof MovingAssetPaginatedResponseSchema>;
export type MovingAssetAggregateDto = z.infer<typeof MovingAssetAggregateDtoSchema>;
export type MovingAssetAggregatePayloadDto = z.infer<typeof MovingAssetAggregatePayloadSchema>;
export type YardCheckMapAssetDto = z.infer<typeof YardCheckMapAssetDtoSchema>;
export type YardCheckMapAssetResponseDto = z.infer<typeof YardCheckMapAssetResponseDtoSchema>;
export type YardCheckMapAssetPayloadDto = z.infer<typeof YardCheckMapAssetPayloadSchema>;
export type AssetIdPayloadDto = z.infer<typeof AssetIdsPayloadSchema>;
