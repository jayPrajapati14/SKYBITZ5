import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getYardCheckAssetsForMap, GetYardCheckAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetYardCheckMapAssets(options: GetYardCheckAssetsParams) {
  return useQuery({
    queryKey: ["map-assets", ...Object.values(options)],
    queryFn: (context) => getYardCheckAssetsForMap(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
