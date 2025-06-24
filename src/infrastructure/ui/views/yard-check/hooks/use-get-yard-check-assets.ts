import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getYardCheckAssets, GetYardCheckAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetYardCheckAssets(options: GetYardCheckAssetsParams) {
  const hasLandmarkIds = (options.landmarkIds?.length ?? 0) > 0;
  const hasLandmarkGroupIds = (options.landmarkGroups?.length ?? 0) > 0;
  const hasAssetIds = (options.ids?.length ?? 0) > 0;
  const byTextSearch = (options.byTextSearch?.length ?? 0) > 0;
  const enabled = hasLandmarkIds || hasLandmarkGroupIds || hasAssetIds || byTextSearch;

  return useQuery({
    queryKey: ["assets", ...Object.values(options)],
    queryFn: (context) => getYardCheckAssets(options, context),
    staleTime: 1000 * 10,
    placeholderData: enabled ? keepPreviousData : undefined,
    enabled,
  });
}
