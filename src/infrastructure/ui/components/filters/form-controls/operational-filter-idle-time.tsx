import { FilterFormControl } from "@/components/filters/filter-form-control";
import { SingleSelect } from "@/components/single-select.txs/single-select";

const options = [
  { value: 4, label: "> 4 hours" },
  { value: 12, label: "> 12 hours" },
  { value: 24, label: "> 24 hours (1 day)" },
  { value: 168, label: "> 168 hours (1 week)" },
  { value: 672, label: "> 672 hours (4 weeks)" },
];

type OperationalFilterIdleTimeProps = {
  idleTime?: number;
  onChange: (idleTime?: number) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function OperationalFilterIdleTime({
  idleTime,
  onChange,
  isPinned,
  onPinChange,
}: OperationalFilterIdleTimeProps) {
  return (
    <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-2">
      <FilterFormControl label="Idle Time" pinned={isPinned} onPinClick={onPinChange}>
        <SingleSelect
          value={idleTime}
          options={options}
          emptyLabel="Select idle time"
          onChange={(value: number) => {
            console.info("value", value);
            onChange(value);
          }}
          onClear={() => onChange(undefined)}
        />
      </FilterFormControl>
    </div>
  );
}
