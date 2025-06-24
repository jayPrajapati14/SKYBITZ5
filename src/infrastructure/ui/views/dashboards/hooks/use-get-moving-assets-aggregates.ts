import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMovingAssetsAggregate, GetMovingAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetMovingAssetsAggregate(options: GetMovingAssetsParams) {
  return useQuery({
    queryKey: ["moving-assets-aggregates", ...Object.values(options)],
    queryFn: (context) => getMovingAssetsAggregate(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
