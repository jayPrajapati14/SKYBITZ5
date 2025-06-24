import { getAssetUrl } from "@/domain/utils/url";

export const highlightMatch = (text: string, query: string): string => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, '<span class="tw-font-bold tw-text-primary">$1</span>');
};

export const openAssetDetailsPage = (assetId: Nullable<string>) => {
  if (assetId) {
    const url = getAssetUrl();
    window.open(`${url}=${assetId}`, "_blank");
  }
};
