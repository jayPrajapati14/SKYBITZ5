import { Metadata } from "@/domain/models/metadata";
import { AssetRepository } from "@/infrastructure/repositories";

/**
 * Sort by field for yard check assets
 * @type {Extract<keyof YardCheckAsset, "idleTimeHours">}
 */
export type YardCheckAssetSortByField = Extract<keyof YardCheckAsset, "idleTimeHours">;

/**
 * Sort by field for accrued distance assets
 * @type {Extract<keyof AccruedDistanceAsset, "accruedDistance">}
 */
export type AccruedDistanceAssetSortByField = Extract<
  keyof AccruedDistanceAsset,
  "accruedDistanceInMiles" | "deviceInstallationDate"
>;

/**
 * Sort by field for assets
 * @type {YardCheckAssetSortByField | AccruedDistanceAssetSortByField}
 */
export type AssetSortBy = {
  field:
    | YardCheckAssetSortByField
    | AccruedDistanceAssetSortByField
    | MovingAssetSortByField
    | IdleAssetSortByField
    | GenericAssetSortByField;
  order: SortDirection;
};

export type GenericAssetSortByField = Extract<keyof GenericAsset, "idleTimeHours">;

export type IdleAssetSortByField = Extract<
  keyof IdleAsset,
  | "idleTimeHours"
  | "lastReportedLandmark"
  | "assetId"
  | "deviceSerialNumber"
  | "arrivedAt"
  | "lastReportedTime"
  | "assetType"
>;

export type MovingAssetSortByField = Extract<
  keyof MovingAsset,
  | "lastReportedLandmark"
  | "assetId"
  | "deviceSerialNumber"
  | "startTime"
  | "duration"
  | "lastReportedTime"
  | "assetType"
>;

/**
 * Parameters for getting yard check assets
 */
export type GetYardCheckAssetsParams = {
  ids?: number[];
  landmarkIds?: number[];
  landmarkGroups?: number[];
  landmarkTypes?: number[];
  excludedAssetIds?: number[];
  types?: number[];
  countries?: string[];
  zipCode?: string;
  lastReported?: number;
  idleTime?: number;
  cargoStatuses?: string[];
  volumetricStatuses?: string[];
  motionStatuses?: string[];
  sortBy?: AssetSortBy;
  states?: string[];
  byTextSearch?: string;
  limit?: number;
  offset?: number;
};

/**
 * Get yard check assets
 * @param options - Parameters for getting yard check assets
 * @param metadata - Metadata for the request
 * @returns The yard check assets paginated response with the assets and total count
 */
export function getYardCheckAssets(
  options: GetYardCheckAssetsParams,
  metadata?: Metadata
): PaginatedResponse<YardCheckAsset, "assets"> {
  return AssetRepository.getYardCheckAssets(options, metadata);
}

export function getYardCheckAssets2(
  options: GetYardCheckAssetsParams,
  metadata?: Metadata
): PaginatedResponse<YardCheckAsset, "assets"> {
  return AssetRepository.getYardCheckAssets2(options, metadata);
}

/**
 * Parameters for getting accrued distance assets
 */
export type GetAccruedDistanceAssetsParams = {
  ids?: number[];
  dateRange: {
    from: Date;
    to: Date;
  };
  limit?: number;
  offset?: number;
  sortBy?: AssetSortBy;
};

/**
 * Get accrued distance assets
 * @param options - Parameters for getting accrued distance assets
 * @param metadata - Metadata for the request
 * @returns The accrued distance assets paginated response with the assets and total count
 */
export function getAccruedDistanceAssets(
  options: GetAccruedDistanceAssetsParams,
  metadata?: Metadata
): PaginatedResponse<AccruedDistanceAsset, "assets"> {
  return AssetRepository.getAccruedDistanceAssets(options, metadata);
}

/**
 * Parameters for getting asset IDs
 */
export type GetAssetIdsParams = {
  assetId?: string;
  ids?: number[];
};

/**
 * Get asset IDs
 * @param options - Parameters for getting asset IDs
 * @returns The asset IDs
 */
export function getAssetIds(options: GetAssetIdsParams, metadata?: Metadata): Promise<Array<AssetId>> {
  return AssetRepository.getAssetIds(options, metadata);
}

/**
 * Get asset types
 * @returns The asset types
 */
export function getAssetTypes(): Promise<Array<AssetType>> {
  return AssetRepository.getAssetTypes();
}

/**
 * Get yard check assets for export
 * @param options - Parameters for getting yard check assets for export
 * @param chunkSize - The chunk size
 * @returns The yard check assets for export
 */
export async function getYardCheckAssetsForExport(
  options: Exclude<GetYardCheckAssetsParams, "limit" | "offset">,
  chunkSize = 100
): Promise<Array<Omit<YardCheckAsset, "sensors"> & { sensors: string }>> {
  const response = await getYardCheckAssets({ ...options, limit: chunkSize, offset: 0 });
  const assets = response.assets;
  const total = response.totalCount;

  const remaining = total - assets.length;
  const pagesRemaining = Math.ceil(remaining / chunkSize);

  const remainingAssets = await Promise.all(
    Array.from({ length: pagesRemaining }).map((_, index) => {
      return getYardCheckAssets({ ...options, limit: chunkSize, offset: (1 + index) * chunkSize });
    })
  );

  assets.push(...remainingAssets.flatMap((asset) => asset.assets));

  return assets.map((asset) => ({
    ...asset,
    sensors: asset.sensors.map((sensor) => `${sensor.type} - ${sensor.status}`).join(", "),
  }));
}

export async function getYardCheck2AssetsForExport(
  options: Exclude<GetYardCheckAssetsParams, "limit" | "offset">,
  chunkSize = 100
): Promise<Array<Omit<YardCheckAsset, "sensors"> & { sensors: string }>> {
  const response = await getYardCheckAssets2({ ...options, limit: chunkSize, offset: 0 });
  const assets = response.assets;
  const total = response.totalCount;

  const remaining = total - assets.length;
  const pagesRemaining = Math.ceil(remaining / chunkSize);

  const remainingAssets = await Promise.all(
    Array.from({ length: pagesRemaining }).map((_, index) => {
      return getYardCheckAssets2({ ...options, limit: chunkSize, offset: (1 + index) * chunkSize });
    })
  );

  assets.push(...remainingAssets.flatMap((asset) => asset.assets));

  return assets.map((asset) => ({
    ...asset,
    sensors: asset.sensors.map((sensor) => `${sensor.type} - ${sensor.status}`).join(", "),
  }));
}

/**
 * Get accrued distance assets for export
 * @param options - Parameters for getting accrued distance assets for export
 * @param chunkSize - The chunk size
 * @returns The accrued distance assets for export
 */
export async function getAccruedDistanceAssetsForExport(
  options: Exclude<GetAccruedDistanceAssetsParams, "limit" | "offset">,
  chunkSize = 100
): Promise<Array<AccruedDistanceAsset>> {
  const response = await getAccruedDistanceAssets({ ...options, limit: chunkSize, offset: 0 });
  const assets = response.assets;
  const total = response.totalCount;

  const remaining = total - assets.length;
  const pagesRemaining = Math.ceil(remaining / chunkSize);

  const remainingAssets = await Promise.all(
    Array.from({ length: pagesRemaining }).map((_, index) => {
      return getAccruedDistanceAssets({ ...options, limit: chunkSize, offset: (1 + index) * chunkSize });
    })
  );

  assets.push(...remainingAssets.flatMap((asset) => asset.assets));

  return assets;
}

/**
 * Parameters for getting generic assets
 */
export type GetGenericAssetsParams = {
  ids?: number[];
  landmarkIds?: number[];
  landmarkGroups?: number[];
  landmarkTypes?: number[];
  excludedAssetIds?: number[];
  types?: number[];
  countries?: string[];
  zipCode?: string;
  lastReported?: number;
  idleTime?: number;
  cargoStatuses?: string[];
  volumetricStatuses?: string[];
  motionStatuses?: string[];
  sortBy?: AssetSortBy;
  states?: string[];
  byTextSearch?: string;
  assetLocationType: AssetLocationType;
  limit?: number;
  offset?: number;
};

/**
 * Get generic assets
 * @param options - Parameters for getting assets
 * @param metadata - Metadata for the request
 * @returns The assets paginated response with the assets and total count
 */
export function getGenericAssets(
  options: GetGenericAssetsParams,
  metadata?: Metadata
): PaginatedResponse<GenericAsset, "assets"> {
  return AssetRepository.getGenericAssets(options, metadata);
}

/**
 * Parameters for getting idle assets
 */
export type GetIdleAssetsParams = {
  ids?: number[];
  landmarkIds?: number[];
  landmarkGroups?: number[];
  landmarkTypes?: number[];
  excludedAssetIds?: number[];
  types?: number[];
  countries?: string[];
  zipCode?: string;
  lastReported?: number;
  idleTime?: number;
  cargoStatuses?: string[];
  volumetricStatuses?: string[];
  motionStatuses?: string[];
  sortBy?: AssetSortBy;
  states?: string[];
  byTextSearch?: string;
  assetLocationType: AssetLocationType;
  limit?: number;
  offset?: number;
};

/**
 * Get idle assets
 * @param options - Parameters for getting assets
 * @param metadata - Metadata for the request
 * @returns The assets paginated response with the assets and total count
 */
export function getIdleAssets(
  options: GetIdleAssetsParams,
  metadata?: Metadata
): PaginatedResponse<IdleAsset, "assets"> {
  return AssetRepository.getIdleAssets(options, metadata);
}

/**
 * Get idle assets aggregates
 * @param options - Parameters for getting assets
 * @param metadata - Metadata for the request
 * @returns The assets paginated response with the assets and total count
 */
export function getIdleAssetsAggregate(options: GetIdleAssetsParams, metadata?: Metadata): Promise<IdleAssetAggregate> {
  return AssetRepository.getIdleAssetsAggregate(options, metadata);
}

/**
 * Get yard check aggregates
 * Parameters for getting moving assets
 */
export function getYardCheckAssetsAggregate(
  options: GetYardCheckAssetsParams,
  metadata?: Metadata
): Promise<YardCheckAssetAggregate> {
  return AssetRepository.getYardCheckAssetsAggregate(options, metadata);
}

export type GetMovingAssetsParams = {
  ids?: number[];
  landmarkIds?: number[];
  landmarkGroups?: number[];
  landmarkTypes?: number[];
  excludedAssetIds?: number[];
  types?: number[];
  countries?: string[];
  zipCode?: string;
  lastReported?: number;
  cargoStatuses?: string[];
  volumetricStatuses?: string[];
  motionStatuses?: string[];
  sortBy?: AssetSortBy;
  states?: string[];
  byTextSearch?: string;
  assetLocationType: AssetLocationType;
  limit?: number;
  offset?: number;
};

/**
 * Get moving assets
 * @param options - Parameters for getting assets
 * @param metadata - Metadata for the request
 * @returns The assets paginated response with the assets and total count
 */
export function getMovingAssets(
  options: GetMovingAssetsParams,
  metadata?: Metadata
): PaginatedResponse<MovingAsset, "assets"> {
  return AssetRepository.getMovingAssets(options, metadata);
}

/**
 * Get moving assets aggregates
 * @param options - Parameters for getting assets
 * @param metadata - Metadata for the request
 * @returns The assets paginated response with the assets and total count
 */
export function getMovingAssetsAggregate(
  options: GetMovingAssetsParams,
  metadata?: Metadata
): Promise<MovingAssetAggregate> {
  return AssetRepository.getMovingAssetsAggregate(options, metadata);
}

/**
 * Parameters for getting yard check assets for map
 */
export type GetYardCheckMapAssetsParams = {
  ids?: number[];
  landmarkIds?: number[];
  landmarkGroups?: number[];
  landmarkTypes?: number[];
  excludedAssetIds?: number[];
  types?: number[];
  countries?: string[];
  zipCode?: string;
  lastReported?: number;
  idleTime?: number;
  cargoStatuses?: string[];
  volumetricStatuses?: string[];
  motionStatuses?: string[];
  states?: string[];
  byTextSearch?: string;
};

/**
 * Get yard check map assets
 * @param options - Parameters for getting yard check assets
 * @param metadata - Metadata for the request
 * @returns The yard check assets paginated response with the assets and total count
 */
export function getYardCheckAssetsForMap(
  options: GetYardCheckMapAssetsParams,
  metadata?: Metadata
): Promise<MapAsset[]> {
  return AssetRepository.getYardCheckAssetsForMap(options, metadata);
}

/**
 * Get assets IDs
 * @param ids - assets unique ids
 * @returns The assets
 */

export function getAssetsByIds({ ids }: GetAssetIdsParams): Promise<Array<AssetId>> {
  return AssetRepository.getAssetsByIds({ ids });
}
