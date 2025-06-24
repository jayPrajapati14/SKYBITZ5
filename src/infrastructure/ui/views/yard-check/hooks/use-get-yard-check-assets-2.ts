import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getYardCheckAssets2, GetYardCheckAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetYardCheckAssets(options: GetYardCheckAssetsParams) {
  return useQuery({
    queryKey: ["yard-check-assets", ...Object.values(options)],
    queryFn: (context) => getYardCheckAssets2(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
