import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getYardCheckAssetsAggregate, GetYardCheckAssetsParams } from "@/domain/services/asset/asset.service";

export function useGetYardCheckAssetsAggregate(options: GetYardCheckAssetsParams) {
  return useQuery({
    queryKey: ["yard-check-assets-aggregates", ...Object.values(options)],
    queryFn: (context) => getYardCheckAssetsAggregate(options, context),
    staleTime: 1000 * 10,
    placeholderData: keepPreviousData,
  });
}
