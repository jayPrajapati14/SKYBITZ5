import { LandmarkPayloadDto } from "../landmark-dto";
import { GetLandmarksParams } from "@/domain/services/landmark/landmark.service";

export function mapLandmarkFiltersToDto(filter: GetLandmarksParams): LandmarkPayloadDto {
  const params: LandmarkPayloadDto = {
    id: filter.ids ?? [],
  };

  return params;
}
