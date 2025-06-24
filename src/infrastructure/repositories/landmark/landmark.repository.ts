import { apiFetch } from "@/infrastructure/api-fetch/api-fetch";
import {
  LandmarkDto,
  LandmarkDtoSchema,
  LandmarkGroupDto,
  LandmarkGroupDtoSchema,
  LandmarkTypeDto,
  LandmarkTypeDtoSchema,
} from "./landmark-dto";
import { mapLandmarkFiltersToDto } from "./mappers/landmark.to-dto";
import { zodParseArray } from "@/infrastructure/zod-parse/zod-parse";

/**
 * Parameters for getting landmarks
 */
type GetLandmarksParams = {
  name?: string;
  ids?: number[];
  includeAll?: boolean;
  limit?: number;
};

/**
 * Get landmarks
 * @param options - Parameters for getting landmarks
 * @returns The landmarks
 */
export async function getLandmarks({ name, ids, includeAll, limit }: GetLandmarksParams): Promise<Landmark[]> {
  const url = "/api/v1/landmark";
  const params = new URLSearchParams();

  if (name) params.set("keyword", name);
  if (ids) params.set("ids", ids.join(","));
  if (includeAll) params.set("includeAll", includeAll.toString());
  if (limit) params.set("limit", limit.toString());

  const landmarks = await apiFetch<LandmarkDto[]>(`${url}?${params.toString()}`);
  const parsedLandmarks = zodParseArray(LandmarkDtoSchema, landmarks);
  return parsedLandmarks.map((landmark) => ({
    id: landmark.id,
    name: landmark.name,
    typeId: landmark.typeId,
    groupId: landmark.groupId,
  }));
}

/**
 * Get landmark groups
 * @returns The landmark groups
 */
export async function getLandmarkGroups(): Promise<Array<LandmarkGroup>> {
  const groups = await apiFetch<Array<LandmarkGroupDto>>("/api/v1/landmark/groups");
  const parsedGroups = zodParseArray(LandmarkGroupDtoSchema, groups);
  return parsedGroups.map((group) => ({ id: group.id, name: group.name }));
}

/**
 * Get landmark types
 * @returns The landmark types
 */
export async function getLandmarkTypes(): Promise<Array<LandmarkType>> {
  const types = await apiFetch<Array<LandmarkTypeDto>>("/api/v1/landmark/types");
  const parsedTypes = zodParseArray(LandmarkTypeDtoSchema, types);
  return parsedTypes.map((type) => ({ id: type.geoTypeID, name: type.name }));
}

/**
 * Get landmarks
 * @param ids - landmarks ids
 * @returns The landmarks
 */

export async function getLandmarksByIds(options: GetLandmarksParams): Promise<Landmark[]> {
  const url = "/api/v1/landmark/batch";
  const params = mapLandmarkFiltersToDto(options);
  const landmarks = await apiFetch<LandmarkDto[]>(url, {
    method: "POST",
    body: JSON.stringify(params),
  });
  const parsedLandmarks = zodParseArray(LandmarkDtoSchema, landmarks);
  return parsedLandmarks.map((landmark) => ({
    id: landmark.id,
    name: landmark.name,
    typeId: landmark.typeId,
    groupId: landmark.groupId,
  }));
}
