import { Metadata } from "@/domain/models/metadata";
import {
  GetAccruedDistanceAssetsParams,
  GetYardCheckAssetsParams,
  GetGenericAssetsParams,
  GetIdleAssetsParams,
  GetMovingAssetsParams,
  GetYardCheckMapAssetsParams,
} from "../../../domain/services/asset/asset.service";
import { apiFetch } from "../../api-fetch/api-fetch";
import {
  AssetIdDto,
  AssetTypeDto,
  AssetTypeDtoSchema,
  YardCheckPaginatedResponseDto,
  AccruedDistancePaginatedResponseDto,
  GenericAssetPaginatedResponseDto,
  IdleAssetPaginatedResponseDto,
  IdleAssetAggregateDto,
  YardCheckAssetAggregateDto,
  MovingAssetPaginatedResponseDto,
  MovingAssetAggregateDto,
  YardCheckMapAssetResponseDto,
} from "./asset-dto";
import {
  mapAccruedDistanceAssetToDomain,
  mapYardCheckAssetToDomain,
  mapGenericAssetToDomain,
  mapIdleAssetToDomain,
  mapIdleAssetAggregateToDomain,
  mapYardCheckAssetAggregateToDomain,
  mapMovingAssetToDomain,
  mapMovingAssetAggregateToDomain,
  mapYardCheckMapAssetToDomain,
} from "./mappers/asset.to-domain";
import {
  mapAccruedDistanceFiltersToDto,
  mapYardCheckFiltersToDto,
  mapGenericAssetFiltersToDto,
  mapIdleAssetFiltersToDto,
  mapIdleAssetAggregateFiltersToDto,
  mapYardCheckAssetAggregateFiltersToDto,
  mapMovingAssetFiltersToDto,
  mapMovingAssetAggregateFiltersToDto,
  mapYardCheckMapFiltersToDto,
  mapIdsFiltersToDto,
} from "./mappers/asset.to-dto";
import { zodParseArray } from "@/infrastructure/zod-parse/zod-parse";

/**
 * Get yard check assets
 * @param options - Parameters for getting yard check assets
 * @param metadata - Metadata
 * @returns The yard check assets
 */
export const getYardCheckAssets = async (
  options: GetYardCheckAssetsParams,
  metadata?: Metadata
): PaginatedResponse<YardCheckAsset, "assets"> => {
  const url = "/api/v1/yard-check";
  const params = mapYardCheckFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<YardCheckPaginatedResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const assets = response.data.map(mapYardCheckAssetToDomain);

  return {
    assets,
    totalCount: response.totalRecords,
  };
};

export const getYardCheckAssets2 = async (
  options: GetYardCheckAssetsParams,
  metadata?: Metadata
): PaginatedResponse<YardCheckAsset, "assets"> => {
  const url = "/api/v1/asset/yard-check-v2";
  const params = mapYardCheckFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<YardCheckPaginatedResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const assets = response.data.map(mapYardCheckAssetToDomain);

  return {
    assets,
    totalCount: response.totalRecords,
  };
};

/**
 * Get accrued distance assets
 * @param options - Parameters for getting accrued distance assets
 * @param metadata - Metadata
 * @returns The accrued distance assets
 */
export const getAccruedDistanceAssets = async (
  options: GetAccruedDistanceAssetsParams,
  metadata?: Metadata
): PaginatedResponse<AccruedDistanceAsset, "assets"> => {
  const url = "/api/v1/mileage/accrued-distance/range";

  const params = mapAccruedDistanceFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<AccruedDistancePaginatedResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  return {
    assets: response.data.map(mapAccruedDistanceAssetToDomain),
    totalCount: response.totalRecords,
  };
};

type GetAssetIdsParams = {
  assetId?: string;
  ids?: number[];
};

/**
 * Get asset IDs
 * @param options - Parameters for getting asset IDs
 * @param signal - Signal
 * @returns The asset IDs
 */
export const getAssetIds = async (options: GetAssetIdsParams, metadata?: Metadata): Promise<Array<AssetId>> => {
  const url = "/api/v1/asset";

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<Array<AssetIdDto>>(url + `?keyword=${options.assetId}`, {
    signal,
  });

  return response.map((asset) => ({
    id: asset.id,
    assetId: asset.custAssetID,
  }));
};

/**
 * Get asset types
 * @returns The asset types
 */
export const getAssetTypes = async (): Promise<Array<AssetType>> => {
  const types = await apiFetch<Array<AssetTypeDto>>("/api/v1/asset/types");
  const parsedTypes = zodParseArray(AssetTypeDtoSchema, types);
  return parsedTypes.map((type) => ({ id: type.id, name: type.assetTypeName }));
};

/**
 * Get generic assets
 * @param options - Parameters for getting assets
 * @param metadata - Metadata
 * @returns The assets
 */
export const getGenericAssets = async (
  options: GetGenericAssetsParams,
  metadata?: Metadata
): PaginatedResponse<GenericAsset, "assets"> => {
  const url = "/api/v1/asset/filter";
  const params = mapGenericAssetFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<GenericAssetPaginatedResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const assets = response.data.map(mapGenericAssetToDomain);

  return {
    assets,
    totalCount: response.totalRecords,
  };
};

/**
 * Get idle assets
 * @param options - Parameters for getting assets
 * @param metadata - Metadata
 * @returns The assets
 */
export const getIdleAssets = async (
  options: GetIdleAssetsParams,
  metadata?: Metadata
): PaginatedResponse<IdleAsset, "assets"> => {
  const url = "/api/v1/asset/idle";
  const params = mapIdleAssetFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<IdleAssetPaginatedResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const assets = response.data.map(mapIdleAssetToDomain);

  return {
    assets,
    totalCount: response.totalRecords,
  };
};

/**
 * Get idle assets aggregates
 * @param options - Parameters for getting assets
 * @param metadata - Metadata
 * @returns The assets
 */
export const getIdleAssetsAggregate = async (
  options: GetIdleAssetsParams,
  metadata?: Metadata
): Promise<IdleAssetAggregate> => {
  const url = "/api/v1/asset/idle/aggregate";
  const params = mapIdleAssetAggregateFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<IdleAssetAggregateDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  return {
    ...mapIdleAssetAggregateToDomain(response),
  };
};

/**
 * Get yard check assets aggregates
 * Get moving assets
 * @param options - Parameters for getting assets
 * @param metadata - Metadata
 * @returns The assets
 */
export const getYardCheckAssetsAggregate = async (
  options: GetYardCheckAssetsParams,
  metadata?: Metadata
): Promise<YardCheckAssetAggregate> => {
  const url = "/api/v1/asset/yard-check/aggregate";
  const params = mapYardCheckAssetAggregateFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<YardCheckAssetAggregateDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });
  return {
    ...mapYardCheckAssetAggregateToDomain(response),
  };
};

export const getMovingAssets = async (
  options: GetMovingAssetsParams,
  metadata?: Metadata
): PaginatedResponse<MovingAsset, "assets"> => {
  const url = "/api/v1/asset/moving";
  const params = mapMovingAssetFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<MovingAssetPaginatedResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  const assets = response.data.map(mapMovingAssetToDomain);
  return {
    assets,
    totalCount: response.totalRecords,
  };
};

/**
 * Get moving assets aggregates
 * @param options - Parameters for getting assets
 * @param metadata - Metadata
 * @returns The assets
 */
export const getMovingAssetsAggregate = async (
  options: GetMovingAssetsParams,
  metadata?: Metadata
): Promise<MovingAssetAggregate> => {
  const url = "/api/v1/asset/moving/aggregate";
  const params = mapMovingAssetAggregateFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<MovingAssetAggregateDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });
  return {
    ...mapMovingAssetAggregateToDomain(response),
  };
};

/**
 * Get yard check assets for map
 * @param options - Parameters for getting yard check assets
 * @param metadata - Metadata
 * @returns The yard check assets
 */
export const getYardCheckAssetsForMap = async (
  options: GetYardCheckMapAssetsParams,
  metadata?: Metadata
): Promise<MapAsset[]> => {
  const url = "/api/v1/asset/yard-check/map";
  const params = mapYardCheckMapFiltersToDto(options);

  const signal = metadata?.signal as AbortSignal;

  const response = await apiFetch<YardCheckMapAssetResponseDto>(url, {
    method: "POST",
    body: JSON.stringify(params),
    signal,
  });

  return response.map(mapYardCheckMapAssetToDomain);
};

/**
 * Get assets IDs
 * @param ids - assets unique ids
 * @returns The assets
 */

export async function getAssetsByIds(options: GetAssetIdsParams): Promise<Array<AssetId>> {
  const url = "/api/v1/asset/batch";
  const params = mapIdsFiltersToDto(options);
  const response = await apiFetch<AssetIdDto[]>(url, {
    method: "POST",
    body: JSON.stringify(params),
  });

  return response.map((asset) => ({
    id: asset.id,
    assetId: asset.custAssetID,
  }));
}
