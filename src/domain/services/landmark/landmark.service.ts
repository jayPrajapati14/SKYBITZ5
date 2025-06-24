import { LandmarkRepository } from "@/infrastructure/repositories";

/**
 * Parameters for getting landmarks
 */
export type GetLandmarksParams = {
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
export function getLandmarks({ name, ids, includeAll, limit }: GetLandmarksParams): Promise<Landmark[]> {
  return LandmarkRepository.getLandmarks({ name, ids, includeAll, limit });
}

/**
 * Get landmark groups
 * @returns The landmark groups
 */
export function getLandmarkGroups(): Promise<Array<LandmarkGroup>> {
  return LandmarkRepository.getLandmarkGroups();
}

/**
 * Get landmark types
 * @returns The landmark types
 */
export function getLandmarkTypes(): Promise<Array<LandmarkType>> {
  return LandmarkRepository.getLandmarkTypes();
}

/**
 * Get landmarks
 * @param ids - landmarks ids
 * @returns The landmarks
 */

export function getLandmarksByIds({ ids }: GetLandmarksParams): Promise<Landmark[]> {
  return LandmarkRepository.getLandmarksByIds({ ids });
}
