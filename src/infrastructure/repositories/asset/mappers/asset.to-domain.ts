import {
  AccruedDistanceAssetDto,
  AccruedDistanceAssetDtoSchema,
  YardCheckAssetDto,
  YardCheckAssetDtoSchema,
  GenericAssetDto,
  GenericAssetDtoSchema,
  IdleAssetDto,
  IdleAssetDtoSchema,
  IdleAssetAggregateDto,
  IdleAssetAggregateDtoSchema,
  YardCheckAssetAggregateDto,
  YardCheckAssetAggregateDtoSchema,
  MovingAssetDto,
  MovingAssetDtoSchema,
  MovingAssetAggregateDto,
  MovingAssetAggregateDtoSchema,
  YardCheckMapAssetDto,
  YardCheckMapAssetDtoSchema,
} from "@/infrastructure/repositories/asset/asset-dto";
import { zodParse } from "@/infrastructure/zod-parse/zod-parse";
import { SensorDto } from "@/infrastructure/repositories/sensor/sensor-dto";
import { LandmarkAssetStatsDto } from "@/infrastructure/repositories/landmark/landmark-dto";
import { SENSOR_TYPE_ORDER } from "@/domain/models/sensor";

function sortedSensorData(sensorData: SensorDto[]): SensorDto[] {
  return sensorData.sort((a, b) => {
    const orderA = SENSOR_TYPE_ORDER[a.sensorType];
    const orderB = SENSOR_TYPE_ORDER[b.sensorType];
    return orderA - orderB;
  });
}

export function mapSensorToDomain(sensorData: SensorDto[]): Sensor[] {
  return sortedSensorData(sensorData).map((sensor) => ({
    type: sensor.sensorType,
    status: sensor.sensorValue,
  })) as Sensor[];
}

function convertMinutesToHours(minutes: number | null): number {
  return minutes ? minutes / 60 : 0;
}

export function mapYardCheckAssetToDomain(yardCheckAssetDto: YardCheckAssetDto): YardCheckAsset {
  const parsedYardCheckAssetDto = zodParse(YardCheckAssetDtoSchema, yardCheckAssetDto);

  return {
    id: parsedYardCheckAssetDto.assetID,
    landmarkGroup: parsedYardCheckAssetDto.landmarkGroupName ?? "",
    assetId: parsedYardCheckAssetDto.custAssetID,
    deviceSerialNumber: parsedYardCheckAssetDto.mtsn ?? "",
    idleTimeHours: parsedYardCheckAssetDto.idleTimeHours,
    arrivedAt: new Date(parsedYardCheckAssetDto.arrivedAtLandmarkMillisUTC),
    lastReportedTime: new Date(parsedYardCheckAssetDto.lastReportedTimeMillisUTC),
    lastReportedLandmark: parsedYardCheckAssetDto.landmarkName,
    landmarkType: parsedYardCheckAssetDto.landmarkTypeId ?? 0,
    type: parsedYardCheckAssetDto.typeId ?? 0,
    sensors: mapSensorToDomain(parsedYardCheckAssetDto.sensorData ?? []),
    assetType: parsedYardCheckAssetDto.assetType ?? "",
  };
}

export function mapAccruedDistanceAssetToDomain(
  accruedDistanceAssetDto: AccruedDistanceAssetDto
): AccruedDistanceAsset {
  const parsedAccruedDistanceAssetDto = zodParse(AccruedDistanceAssetDtoSchema, accruedDistanceAssetDto);

  return {
    id: parsedAccruedDistanceAssetDto.assetID,
    assetId: parsedAccruedDistanceAssetDto.custAssetID,
    accruedDistanceInMiles: parsedAccruedDistanceAssetDto.accruedDistanceInMiles,
    assetType: parsedAccruedDistanceAssetDto.assetType,
    deviceSerialNumber: parsedAccruedDistanceAssetDto.mtsn,
    deviceInstallationDate: parsedAccruedDistanceAssetDto.deviceInstalledOnMilliUTC
      ? new Date(parsedAccruedDistanceAssetDto.deviceInstalledOnMilliUTC)
      : null,

    arrivedAt: new Date(parsedAccruedDistanceAssetDto.lastReportedAtMillisUTC),
    lastReportedLandmark: parsedAccruedDistanceAssetDto.lastLandmark ?? null,
  };
}

export function mapGenericAssetToDomain(GenericAssetDto: GenericAssetDto): GenericAsset {
  const parsedAssetsDto = zodParse(GenericAssetDtoSchema, GenericAssetDto);

  return {
    id: parsedAssetsDto.assetID,
    assetId: parsedAssetsDto.custAssetID,
    assetType: parsedAssetsDto.assetType ?? "",
    deviceSerialNumber: parsedAssetsDto.mtsn ?? "",
    arrivedAt: parsedAssetsDto.arrivedAtLandmarkMillisUTC ? new Date(parsedAssetsDto.arrivedAtLandmarkMillisUTC) : null,
    idleTimeHours: parsedAssetsDto.idleTimeHours ?? 0,
    lastReportedLandmark: parsedAssetsDto.landmarkName,
    sensors: mapSensorToDomain(parsedAssetsDto.sensorData ?? []),
    lastReportedTime: new Date(parsedAssetsDto.lastReportedTimeMillisUTC),
    startTime: parsedAssetsDto.startedMovingFromMillisUTC ? new Date(parsedAssetsDto.startedMovingFromMillisUTC) : null,
    duration: convertMinutesToHours(parsedAssetsDto.movingDurationMinutes),
    geoType: parsedAssetsDto.geoClass,
    direction: parsedAssetsDto.direction ?? null,
    distanceFromLandmarkInMiles: parsedAssetsDto.distanceFromLandmarkMiles ?? 0,
    geoCity: parsedAssetsDto.city ?? null,
    geoState: parsedAssetsDto.stateAbbr ?? null,
    geoZipCode: parsedAssetsDto.zip ?? null,
  };
}

export function mapIdleAssetToDomain(IdleAssetDto: IdleAssetDto): IdleAsset {
  const parsedAssetsDto = zodParse(IdleAssetDtoSchema, IdleAssetDto);

  return {
    id: parsedAssetsDto.assetID,
    assetId: parsedAssetsDto.custAssetID,
    assetType: parsedAssetsDto.assetType ?? "",
    deviceSerialNumber: parsedAssetsDto.mtsn ?? "",
    arrivedAt: new Date(parsedAssetsDto.arrivedAtLandmarkMillisUTC),
    idleTimeHours: parsedAssetsDto.idleTimeHours,
    lastReportedLandmark: parsedAssetsDto.landmarkName,
    sensors: mapSensorToDomain(parsedAssetsDto.sensorData ?? []),
    lastReportedTime: new Date(parsedAssetsDto.lastReportedTimeMillisUTC),
    geoType: parsedAssetsDto.geoClass,
    direction: parsedAssetsDto.direction ?? null,
    distanceFromLandmarkInMiles: parsedAssetsDto.distanceFromLandmarkMiles ?? 0,
    geoCity: parsedAssetsDto.city ?? null,
    geoState: parsedAssetsDto.stateAbbr ?? null,
    geoZipCode: parsedAssetsDto.zip ?? null,
  };
}

export function mapIdleAssetAggregateToDomain(IdleAssetAggregateDto: IdleAssetAggregateDto): IdleAssetAggregate {
  const parsedAssetsDto = zodParse(IdleAssetAggregateDtoSchema, IdleAssetAggregateDto);

  return {
    idle: parsedAssetsDto.totalIdleAssets,
    empty: parsedAssetsDto.distribution.withEmptyCargo,
    partiallyLoaded: parsedAssetsDto.distribution.withPartiallyLoadedCargo,
    loaded: parsedAssetsDto.distribution.withLoadedCargo,
    other: parsedAssetsDto.distribution.withOtherCargoStatus,
    total: parsedAssetsDto.totalIdleAssets,
  };
}

export function mapLandmarkAssetStatsToDomain(landmarkStates: LandmarkAssetStatsDto[]): LandmarkAssetStats[] {
  return landmarkStates.map((landmark) => ({
    id: landmark.landmarkID,
    name: landmark.landmarkName,
    emptyAssets: landmark.emptyAssetsCount,
    totalAssets: landmark.totalAssetsCount,
    latitude: landmark.lat,
    longitude: landmark.longt,
  })) as LandmarkAssetStats[];
}

export function mapYardCheckAssetAggregateToDomain(
  YardCheckAssetAggregateDto: YardCheckAssetAggregateDto
): YardCheckAssetAggregate {
  const parsedAssetsDto = zodParse(YardCheckAssetAggregateDtoSchema, YardCheckAssetAggregateDto);

  return {
    totalLandmarks: parsedAssetsDto.yards,
    emptyAssets: parsedAssetsDto.totalEmptyAssets,
    landmarks: mapLandmarkAssetStatsToDomain(parsedAssetsDto.yardDetails),
  };
}

export function mapMovingAssetToDomain(MovingAssetDto: MovingAssetDto): MovingAsset {
  const parsedAssetsDto = zodParse(MovingAssetDtoSchema, MovingAssetDto);

  return {
    id: parsedAssetsDto.assetID,
    assetId: parsedAssetsDto.custAssetID,
    assetType: parsedAssetsDto.assetType ?? "",
    deviceSerialNumber: parsedAssetsDto.mtsn ?? "",
    lastReportedLandmark: parsedAssetsDto.landmarkName,
    sensors: mapSensorToDomain(parsedAssetsDto.sensorData ?? []),
    lastReportedTime: new Date(parsedAssetsDto.lastReportedTimeMillisUTC),
    startTime: parsedAssetsDto.startedMovingFromMillisUTC ? new Date(parsedAssetsDto.startedMovingFromMillisUTC) : null,
    duration: convertMinutesToHours(parsedAssetsDto.movingDurationMinutes),
    geoType: parsedAssetsDto.geoClass,
    direction: parsedAssetsDto.direction ?? null,
    distanceFromLandmarkInMiles: parsedAssetsDto.distanceFromLandmarkMiles ?? 0,
    geoCity: parsedAssetsDto.city ?? null,
    geoState: parsedAssetsDto.stateAbbr ?? null,
    geoZipCode: parsedAssetsDto.zip ?? null,
  };
}

export function mapMovingAssetAggregateToDomain(
  MovingAssetAggregateDto: MovingAssetAggregateDto
): MovingAssetAggregate {
  const parsedAssetsDto = zodParse(MovingAssetAggregateDtoSchema, MovingAssetAggregateDto);
  return {
    moving: parsedAssetsDto.totalMovingAssets,
    empty: parsedAssetsDto.distribution.withEmptyCargo,
    partiallyLoaded: parsedAssetsDto.distribution.withPartiallyLoadedCargo,
    loaded: parsedAssetsDto.distribution.withLoadedCargo,
    other: parsedAssetsDto.distribution.withOtherCargoStatus,
    total: parsedAssetsDto.totalMovingAssets,
  };
}

export function mapYardCheckMapAssetToDomain(YardCheckMapAssetDto: YardCheckMapAssetDto): MapAsset {
  const parsedAssetsDto = zodParse(YardCheckMapAssetDtoSchema, YardCheckMapAssetDto);
  return {
    id: parsedAssetsDto.landmarkID,
    latitude: parsedAssetsDto.lat,
    longitude: parsedAssetsDto.longt,
    boundary:
      parsedAssetsDto.polygons?.map((polygon) => ({
        latitude: polygon.lat,
        longitude: polygon.longt,
      })) ?? [],
    assets:
      parsedAssetsDto.assets?.map((asset) => ({
        assetId: asset.custAssetID,
        latitude: asset.lat ? asset.lat : parsedAssetsDto.lat,
        longitude: asset.longt ? asset.longt : parsedAssetsDto.longt,
        idleTimeHours: asset.idleTimeHours,
      })) ?? [],
  };
}
