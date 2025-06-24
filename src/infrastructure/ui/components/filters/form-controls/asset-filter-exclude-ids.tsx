import { MultiSelectAsync } from "@/components/multi-select-async/multi-select-async";
import { getAssetIds } from "@/domain/services/asset/asset.service";
import { FilterFormControl } from "@/components/filters/filter-form-control";

type AssetFilterExcludeIdsProps = {
  ids: AssetId[];
  recentIds: AssetId[];
  onChange: (ids: AssetId[]) => void;
  onBlur: (ids: AssetId[]) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function AssetFilterExcludeIds({
  ids,
  recentIds,
  onChange,
  onBlur,
  isPinned,
  onPinChange,
}: AssetFilterExcludeIdsProps) {
  return (
    <FilterFormControl label="Exclude Assets" pinned={isPinned} onPinClick={onPinChange}>
      <MultiSelectAsync
        getOptions={(inputText: string) => getAssetIds({ assetId: inputText })}
        getOptionId={(option) => option.id}
        getOptionLabel={(option) => option.assetId ?? option.id.toString()}
        noOptionsText="No assets"
        placeholder="Type to find an Asset Id"
        value={ids || []}
        defaultOptions={recentIds}
        onChange={(_event, ids) => onChange(ids)}
        onBlur={() => onBlur(ids)}
      />
    </FilterFormControl>
  );
}
