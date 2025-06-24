import { apiFetch } from "@/infrastructure/api-fetch/api-fetch";
import { QuickSearchResponseDto } from "./quick-search-dto";
import { mapQuickSearchAssetsToDomain } from "./mappers/quick-search.to-domain";
import { Metadata } from "@/domain/models/metadata";
import { quickSearchAssetsParams } from "@/domain/services/quick-search/quick-search.service";

export async function quickSearch(options: quickSearchAssetsParams, metadata?: Metadata): Promise<QuickSearchResult> {
  const url = "/api/v1/search/quick";
  const params = new URLSearchParams();
  const keyword = options.byTextSearch;
  const lastReported = options.lastReported;

  if (keyword) params.set("keyword", keyword);
  if (lastReported) params.set("reportedWithinPastDays", lastReported.toString());

  const signal = metadata?.signal as AbortSignal;
  const response = await apiFetch<QuickSearchResponseDto>(`${url}?${params.toString()}`, { signal });
  const assets = response.assets.map(mapQuickSearchAssetsToDomain);
  return {
    assets,
  };
}
