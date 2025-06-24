import { SearchRepository } from "@/infrastructure/repositories";
import { Metadata } from "@/domain/models/metadata";

export type quickSearchAssetsParams = {
  byTextSearch: string;
  lastReported?: number;
};

export function quickSearch(options: quickSearchAssetsParams, metadata?: Metadata): Promise<QuickSearchResult> {
  return SearchRepository.quickSearch(options, metadata);
}
