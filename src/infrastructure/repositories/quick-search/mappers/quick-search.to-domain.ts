import { QuickSearchDto, QuickSearchDtoSchema } from "@/infrastructure/repositories/quick-search/quick-search-dto";
import { zodParse } from "@/infrastructure/zod-parse/zod-parse";

export function mapQuickSearchAssetsToDomain(assetDto: QuickSearchDto): QuickSearchAsset {
  const parsedAssetDto = zodParse(QuickSearchDtoSchema, assetDto);

  return {
    id: parsedAssetDto.id,
    assetId: parsedAssetDto.custAssetID,
    assetType: parsedAssetDto.type,
    deviceSerialNumber: parsedAssetDto.mtsn,
    deviceId: parsedAssetDto.mtid,
  };
}
