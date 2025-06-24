import { FilterFormControl } from "@/components/filters/filter-form-control";
import { SingleSelect } from "@/components/single-select.txs/single-select";

const options = [
  { value: 7, label: "1 week (last 7 days)" },
  { value: 14, label: "2 weeks (last 14 days)" },
  { value: 21, label: "3 weeks (last 21 days)" },
  { value: 28, label: "4 weeks (last 28 days)" },
];

type OperationalFilterLastReportedProps = {
  lastReported?: number;
  onChange: (lastReported?: number) => void;
  isPinned: boolean;
  onPinChange?: (status: boolean) => void;
};

export function OperationalFilterLastReported({
  lastReported,
  onChange,
  isPinned,
  onPinChange,
}: OperationalFilterLastReportedProps) {
  return (
    <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-2">
      <FilterFormControl label="Last Reported" pinned={isPinned} onPinClick={onPinChange}>
        <SingleSelect
          value={lastReported}
          options={options}
          emptyLabel="Select a date range"
          onChange={(value) => onChange(value)}
          onClear={() => onChange(28)}
        />
      </FilterFormControl>
    </div>
  );
}
