import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getGenericAssets, GetGenericAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetGenericAssets(options: GetGenericAssetsParams) {
  return useQuery({
    queryKey: ["generic-assets", ...Object.values(options)],
    queryFn: (context) => getGenericAssets(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
