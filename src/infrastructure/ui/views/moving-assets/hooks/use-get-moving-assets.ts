import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMovingAssets, GetMovingAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetMovingAssets(options: GetMovingAssetsParams) {
  return useQuery({
    queryKey: ["moving-assets", ...Object.values(options)],
    queryFn: (context) => getMovingAssets(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
