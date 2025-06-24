import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIdleAssets, GetIdleAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetIdleAssets(options: GetIdleAssetsParams) {
  return useQuery({
    queryKey: ["assets", ...Object.values(options)],
    queryFn: (context) => getIdleAssets(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
