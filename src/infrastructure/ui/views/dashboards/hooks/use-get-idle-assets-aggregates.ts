import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getIdleAssetsAggregate, GetIdleAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetIdleAssetsAggregate(options: GetIdleAssetsParams) {
  return useQuery({
    queryKey: ["idle-assets-aggregates", ...Object.values(options)],
    queryFn: (context) => getIdleAssetsAggregate(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
