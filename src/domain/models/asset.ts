declare global {
  export type AssetType = {
    id: number;
    name?: string;
  };

  export type AssetId = {
    id: number;
    assetId?: string;
  };

  export type Asset = {
    id: number;
    assetId: string;
    idleTimeHours?: number;
    arrivedAt?: Nullable<Date>;
    lastReportedLandmark?: Nullable<string>;
    lastReportedTime?: Date;
    landmarkGroup?: string;
    landmarkType?: number;
    type?: number;
    sensors?: Sensor[];
    accruedDistanceInMiles?: number;
    deviceInstallationDate?: Nullable<Date>;
    deviceSerialNumber?: string;
    assetType?: string;
    latitude?: number;
    longitude?: number;
    idleTimeDays?: number;
    startTime?: Nullable<Date>;
    duration?: number;
    geoType: AssetGeoType;
    direction?: Nullable<AssetDirection>;
    distanceFromLandmarkInMiles?: Nullable<number>;
    geoCity: Nullable<string>;
    geoState: Nullable<string>;
    geoZipCode: Nullable<string>;
  };

  export type YardCheckAsset = Required<
    Pick<
      Asset,
      | "id"
      | "assetId"
      | "idleTimeHours"
      | "arrivedAt"
      | "lastReportedTime"
      | "lastReportedLandmark"
      | "landmarkGroup"
      | "landmarkType"
      | "type"
      | "sensors"
      | "deviceSerialNumber"
      | "assetType"
    >
  >;

  export type AccruedDistanceAsset = Required<
    Pick<
      Asset,
      | "id"
      | "assetId"
      | "accruedDistanceInMiles"
      | "deviceInstallationDate"
      | "deviceSerialNumber"
      | "assetType"
      | "arrivedAt"
      | "lastReportedLandmark"
    >
  >;

  export type GenericAsset = Required<
    Pick<
      Asset,
      | "id"
      | "assetId"
      | "assetType"
      | "deviceSerialNumber"
      | "idleTimeHours"
      | "arrivedAt"
      | "sensors"
      | "lastReportedTime"
      | "lastReportedLandmark"
      | "startTime"
      | "duration"
      | "geoType"
      | "direction"
      | "distanceFromLandmarkInMiles"
      | "geoCity"
      | "geoState"
      | "geoZipCode"
    >
  >;

  export type IdleAsset = Required<
    Pick<
      Asset,
      | "id"
      | "assetId"
      | "assetType"
      | "deviceSerialNumber"
      | "arrivedAt"
      | "idleTimeHours"
      | "sensors"
      | "lastReportedTime"
      | "lastReportedLandmark"
      | "geoType"
      | "direction"
      | "distanceFromLandmarkInMiles"
      | "geoCity"
      | "geoState"
      | "geoZipCode"
    >
  >;

  type MovingAsset = Required<
    Pick<
      Asset,
      | "id"
      | "assetId"
      | "assetType"
      | "deviceSerialNumber"
      | "sensors"
      | "lastReportedTime"
      | "lastReportedLandmark"
      | "startTime"
      | "duration"
      | "geoType"
      | "direction"
      | "distanceFromLandmarkInMiles"
      | "geoCity"
      | "geoState"
      | "geoZipCode"
    >
  >;

  export type IdleAssetAggregate = {
    idle: number;
    empty: number;
    partiallyLoaded: number;
    loaded: number;
    other: number;
    total: number;
  };

  export type YardCheckAssetAggregate = {
    totalLandmarks: number;
    emptyAssets: number;
    landmarks: LandmarkAssetStats[];
  };

  export type AssetIdleTimeStat = {
    low: number;
    mid: number;
    high: number;
  };

  export type MovingAssetAggregate = {
    moving: number;
    empty: number;
    partiallyLoaded: number;
    loaded: number;
    other: number;
    total: number;
  };

  export type AssetMarker = Required<Pick<Asset, "assetId" | "latitude" | "longitude" | "idleTimeHours">>;

  export type MapAsset = Required<Pick<Landmark, "id" | "latitude" | "longitude" | "boundary">> & {
    assets: AssetMarker[];
  };

  export type AssetLocationType = "AT_LANDMARK" | "NOT_AT_LANDMARK" | "ANYWHERE";
  export type AssetGeoType = "POI" | "GENERIC" | "CUSTOM";
  export type AssetDirection = "S" | "SW" | "W" | "NW" | "N" | "NE" | "E" | "SE";
}
