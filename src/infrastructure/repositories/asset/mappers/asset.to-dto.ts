import {
  AssetSortBy,
  YardCheckAssetSortByField,
  AccruedDistanceAssetSortByField,
  GetAccruedDistanceAssetsParams,
  GetYardCheckAssetsParams,
  GetGenericAssetsParams,
  GetIdleAssetsParams,
  GetMovingAssetsParams,
  GenericAssetSortByField,
  IdleAssetSortByField,
  MovingAssetSortByField,
  GetYardCheckMapAssetsParams,
  GetAssetIdsParams,
} from "@/domain/services/asset/asset.service";
import {
  AccruedDistancePayloadDto,
  SortingDto,
  YardCheckAssetPayloadDto,
  GenericAssetPayloadDto,
  IdleAssetPayloadDto,
  IdleAssetAggregatePayloadDto,
  YardCheckAssetAggregatePayloadDto,
  MovingAssetPayloadDto,
  MovingAssetAggregatePayloadDto,
  YardCheckMapAssetPayloadDto,
  AssetIdPayloadDto,
} from "../asset-dto";

export function mapSortByFieldToDto(sortBy: AssetSortBy | undefined): SortingDto[] {
  if (!sortBy?.field) return [];

  const map: Record<
    | YardCheckAssetSortByField
    | AccruedDistanceAssetSortByField
    | GenericAssetSortByField
    | IdleAssetSortByField
    | MovingAssetSortByField,
    | "idleTimeHours"
    | "accruedDistanceInMiles"
    | "movingDurationMinutes"
    | "landmarkName"
    | "custAssetID"
    | "mtsn"
    | "arrivedAtLandmarkMillisUTC"
    | "assetType"
    | "lastReportedTimeMillisUTC"
    | "startedMovingFromMillisUTC"
    | "deviceInstalledOnMilliUTC"
  > = {
    idleTimeHours: "idleTimeHours",
    accruedDistanceInMiles: "accruedDistanceInMiles",
    duration: "movingDurationMinutes",
    lastReportedLandmark: "landmarkName",
    assetId: "custAssetID",
    deviceSerialNumber: "mtsn",
    arrivedAt: "arrivedAtLandmarkMillisUTC",
    assetType: "assetType",
    lastReportedTime: "lastReportedTimeMillisUTC",
    startTime: "startedMovingFromMillisUTC",
    deviceInstallationDate: "deviceInstalledOnMilliUTC",
  };

  const field = map[sortBy.field];

  return [{ field, order: sortBy.order === "asc" ? "ASC" : "DESC" }];
}

const emptyArrayToNull = <T>(array: T[] | undefined): T[] | null => (array && array.length > 0 ? array : null);
const undefinedToNull = <T>(value: T | undefined): T | null => (value !== undefined ? value : null);

export function mapYardCheckFiltersToDto(filters: GetYardCheckAssetsParams): YardCheckAssetPayloadDto {
  const params: YardCheckAssetPayloadDto = {
    page: 1 + (filters.offset ?? 0) / (filters.limit ?? 50),
    size: filters.limit ?? 50,
    filters: {
      assetIDs: emptyArrayToNull(filters.ids),
      assetTypeID: undefinedToNull(filters.types?.[0]),
      geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
      geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
      geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
      countryAbbreviation: undefinedToNull(filters.countries?.[0]),
      stateAbbreviation: undefinedToNull(filters.states?.[0]),
      zipCode: undefinedToNull(filters.zipCode),
      cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
      motionStatuses: emptyArrayToNull(filters.motionStatuses),
      idleTimeHoursGtThan: undefinedToNull(filters.idleTime),
      reportedWithinPastDays: filters.lastReported,
      sort: mapSortByFieldToDto(filters.sortBy),
      searchKeyword: undefinedToNull(filters.byTextSearch),
      volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
    },
  };

  return params;
}

export function mapAccruedDistanceFiltersToDto(filters: GetAccruedDistanceAssetsParams): AccruedDistancePayloadDto {
  const params: AccruedDistancePayloadDto = {
    page: 1 + (filters.offset ?? 0) / (filters.limit ?? 50),
    size: filters.limit ?? 50,
    filters: {
      assetIDs: emptyArrayToNull(filters.ids),
      fromMillisUTC: filters.dateRange.from.getTime(),
      toMillisUTC: filters.dateRange.to.getTime(),
      accruedDistanceSortInDescending: filters.sortBy?.order === "desc",
      sort: mapSortByFieldToDto(filters.sortBy),
    },
  };

  return params;
}

export function mapGenericAssetFiltersToDto(filters: GetGenericAssetsParams): GenericAssetPayloadDto {
  const params: GenericAssetPayloadDto = {
    page: 1 + (filters.offset ?? 0) / (filters.limit ?? 50),
    size: filters.limit ?? 50,
    filters: {
      assetIDs: emptyArrayToNull(filters.ids),
      assetTypeID: undefinedToNull(filters.types?.[0]),
      geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
      geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
      geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
      countryAbbreviation: undefinedToNull(filters.countries?.[0]),
      stateAbbreviation: undefinedToNull(filters.states?.[0]),
      zipCode: undefinedToNull(filters.zipCode),
      cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
      motionStatuses: emptyArrayToNull(filters.motionStatuses),
      idleTimeHoursGtThan: undefinedToNull(filters.idleTime),
      reportedWithinPastDays: filters.lastReported,
      sort: mapSortByFieldToDto(filters.sortBy),
      searchKeyword: undefinedToNull(filters.byTextSearch),
      assetLocationType: filters.assetLocationType,
      volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
    },
  };

  return params;
}

export function mapIdleAssetFiltersToDto(filters: GetIdleAssetsParams): IdleAssetPayloadDto {
  const params: IdleAssetPayloadDto = {
    page: 1 + (filters.offset ?? 0) / (filters.limit ?? 50),
    size: filters.limit ?? 50,
    filters: {
      assetIDs: emptyArrayToNull(filters.ids),
      assetTypeID: undefinedToNull(filters.types?.[0]),
      geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
      geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
      geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
      countryAbbreviation: undefinedToNull(filters.countries?.[0]),
      stateAbbreviation: undefinedToNull(filters.states?.[0]),
      zipCode: undefinedToNull(filters.zipCode),
      cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
      motionStatuses: emptyArrayToNull(filters.motionStatuses),
      idleTimeHoursGtThan: undefinedToNull(filters.idleTime),
      reportedWithinPastDays: filters.lastReported,
      sort: mapSortByFieldToDto(filters.sortBy),
      searchKeyword: undefinedToNull(filters.byTextSearch),
      assetLocationType: filters.assetLocationType,
      volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
    },
  };

  return params;
}

export function mapIdleAssetAggregateFiltersToDto(filters: GetIdleAssetsParams): IdleAssetAggregatePayloadDto {
  const params: IdleAssetAggregatePayloadDto = {
    assetIDs: emptyArrayToNull(filters.ids),
    assetTypeID: undefinedToNull(filters.types?.[0]),
    geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
    geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
    geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
    countryAbbreviation: undefinedToNull(filters.countries?.[0]),
    stateAbbreviation: undefinedToNull(filters.states?.[0]),
    zipCode: undefinedToNull(filters.zipCode),
    cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
    motionStatuses: emptyArrayToNull(filters.motionStatuses),
    idleTimeHoursGtThan: undefinedToNull(filters.idleTime),
    reportedWithinPastDays: filters.lastReported,
    sort: mapSortByFieldToDto(filters.sortBy),
    searchKeyword: undefinedToNull(filters.byTextSearch),
    assetLocationType: filters.assetLocationType,
    volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
  };

  return params;
}

export function mapYardCheckAssetAggregateFiltersToDto(
  filters: GetYardCheckAssetsParams
): YardCheckAssetAggregatePayloadDto {
  const params: YardCheckAssetAggregatePayloadDto = {
    assetIDs: emptyArrayToNull(filters.ids),
    assetTypeID: undefinedToNull(filters.types?.[0]),
    geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
    geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
    geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
    countryAbbreviation: undefinedToNull(filters.countries?.[0]),
    stateAbbreviation: undefinedToNull(filters.states?.[0]),
    zipCode: undefinedToNull(filters.zipCode),
    cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
    motionStatuses: emptyArrayToNull(filters.motionStatuses),
    idleTimeHoursGtThan: undefinedToNull(filters.idleTime),
    reportedWithinPastDays: filters.lastReported,
    sort: mapSortByFieldToDto(filters.sortBy),
    searchKeyword: undefinedToNull(filters.byTextSearch),
    volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
  };

  return params;
}

export function mapMovingAssetFiltersToDto(filters: GetMovingAssetsParams): MovingAssetPayloadDto {
  const params: MovingAssetPayloadDto = {
    page: 1 + (filters.offset ?? 0) / (filters.limit ?? 50),
    size: filters.limit ?? 50,
    filters: {
      assetIDs: emptyArrayToNull(filters.ids),
      assetTypeID: undefinedToNull(filters.types?.[0]),
      geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
      geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
      geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
      countryAbbreviation: undefinedToNull(filters.countries?.[0]),
      stateAbbreviation: undefinedToNull(filters.states?.[0]),
      zipCode: undefinedToNull(filters.zipCode),
      cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
      motionStatuses: emptyArrayToNull(filters.motionStatuses),
      reportedWithinPastDays: filters.lastReported,
      sort: mapSortByFieldToDto(filters.sortBy),
      searchKeyword: undefinedToNull(filters.byTextSearch),
      assetLocationType: filters.assetLocationType,
      volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
    },
  };

  return params;
}

export function mapMovingAssetAggregateFiltersToDto(filters: GetMovingAssetsParams): MovingAssetAggregatePayloadDto {
  const params: MovingAssetAggregatePayloadDto = {
    assetIDs: emptyArrayToNull(filters.ids),
    assetTypeID: undefinedToNull(filters.types?.[0]),
    geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
    geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
    geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
    countryAbbreviation: undefinedToNull(filters.countries?.[0]),
    stateAbbreviation: undefinedToNull(filters.states?.[0]),
    zipCode: undefinedToNull(filters.zipCode),
    cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
    motionStatuses: emptyArrayToNull(filters.motionStatuses),
    reportedWithinPastDays: filters.lastReported,
    sort: mapSortByFieldToDto(filters.sortBy),
    searchKeyword: undefinedToNull(filters.byTextSearch),
    assetLocationType: filters.assetLocationType,
    volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
  };

  return params;
}

export function mapYardCheckMapFiltersToDto(filters: GetYardCheckMapAssetsParams): YardCheckMapAssetPayloadDto {
  const params: YardCheckMapAssetPayloadDto = {
    assetIDs: emptyArrayToNull(filters.ids),
    assetTypeID: undefinedToNull(filters.types?.[0]),
    geoTypeID: undefinedToNull(filters.landmarkTypes?.[0]),
    geoInfoIDs: emptyArrayToNull(filters.landmarkIds),
    geoGrpIDs: emptyArrayToNull(filters.landmarkGroups),
    countryAbbreviation: undefinedToNull(filters.countries?.[0]),
    stateAbbreviation: undefinedToNull(filters.states?.[0]),
    zipCode: undefinedToNull(filters.zipCode),
    cargoStatuses: emptyArrayToNull(filters.cargoStatuses),
    motionStatuses: emptyArrayToNull(filters.motionStatuses),
    idleTimeHoursGtThan: undefinedToNull(filters.idleTime),
    reportedWithinPastDays: filters.lastReported,
    searchKeyword: undefinedToNull(filters.byTextSearch),
    volumetricStatuses: emptyArrayToNull(filters.volumetricStatuses),
  };

  return params;
}

export function mapIdsFiltersToDto(filter: GetAssetIdsParams): AssetIdPayloadDto {
  const params: AssetIdPayloadDto = {
    id: filter.ids ?? [],
  };

  return params;
}
