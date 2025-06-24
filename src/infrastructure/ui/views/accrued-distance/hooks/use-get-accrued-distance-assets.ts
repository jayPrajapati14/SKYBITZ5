import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAccruedDistanceAssets, GetAccruedDistanceAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetAccruedDistanceAssets(options: GetAccruedDistanceAssetsParams) {
  return useQuery({
    queryKey: ["accrued-distance-assets", ...Object.values(options)],
    queryFn: (context) => getAccruedDistanceAssets(options, context),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 10,
  });
}
