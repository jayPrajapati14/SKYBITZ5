import { FilterFormControl } from "@/components/filters/filter-form-control";
import { SingleSelect } from "@/components/single-select.txs/single-select";

// Using string values because MUI Select requires string values or numbers
const options: { value: AssetLocationType; label: string }[] = [
  { value: "AT_LANDMARK", label: "Assets only at landmarks" },
  { value: "NOT_AT_LANDMARK", label: "Assets not at landmarks" },
];

type OperationalFilterLandmarkProps = {
  assetLocationType?: AssetLocationType;
  onChange: (assetLocationType?: AssetLocationType) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
  disabled?: boolean;
};

export function OperationalFilterLandmark({
  assetLocationType,
  onChange,
  isPinned,
  onPinChange,
  disabled = false,
}: OperationalFilterLandmarkProps) {
  return (
    <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-2">
      <FilterFormControl label="Assets at landmarks" pinned={isPinned} onPinClick={onPinChange}>
        <SingleSelect
          disabled={disabled}
          value={options.filter((opt) => opt.value === assetLocationType).length > 0 ? assetLocationType : undefined}
          options={options}
          emptyLabel="Assets anywhere"
          onChange={(value: AssetLocationType) => onChange(value)}
          onClear={() => onChange(undefined)}
        />
      </FilterFormControl>
    </div>
  );
}
