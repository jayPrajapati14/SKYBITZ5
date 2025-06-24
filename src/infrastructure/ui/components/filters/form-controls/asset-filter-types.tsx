import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { FilterFormControl } from "@/components/filters/filter-form-control";
import { useQuery } from "@tanstack/react-query";
import { getAssetTypes } from "@/domain/services/asset/asset.service";
import { CONFIG } from "@/domain/config";

function useGetAssetTypes() {
  const { data, isLoading } = useQuery({
    queryKey: ["asset-types"],
    queryFn: getAssetTypes,
    staleTime: CONFIG.staticValuesStaleTime,
  });

  return { assetTypes: data ?? [], isLoading };
}

type AssetFilterTypesProps = {
  types: AssetType[];
  recentTypes: AssetType[];
  onChange: (types: AssetType[]) => void;
  onBlur: (types: AssetType[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function AssetFilterTypes({
  types,
  recentTypes,
  onChange,
  onBlur,
  isPinned,
  onPinChange,
}: AssetFilterTypesProps) {
  const { assetTypes, isLoading } = useGetAssetTypes();

  return (
    <FilterFormControl label="Asset Type" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={assetTypes}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.name ?? option.id.toString()}
        noOptionsText="No assets"
        placeholder="Type to find an Asset Type"
        value={types || []}
        defaultOptions={recentTypes}
        onChange={(_event, types) => onChange(types)}
        onBlur={() => onBlur(types)}
        loading={isLoading}
        maxSelectedOptions={1}
      />
    </FilterFormControl>
  );
}
