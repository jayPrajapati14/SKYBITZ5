import { FilterFormControl } from "@/components/filters/filter-form-control";

import { DateRangePicker } from "@/components/date-range-picker/date-range-picker";

type OperationalFilterDateRangeProps = {
  placement?: "left" | "right";
  dateRange?: { from: Date; to: Date };
  onChange: (range: { from: Date; to: Date }) => void;
  isPinned: boolean;
  onPinChange: (status: boolean) => void;
};

export function OperationalFilterDateRange({
  placement = "left",
  dateRange,
  onChange,
  isPinned,
  onPinChange,
}: OperationalFilterDateRangeProps) {
  const range = dateRange ? { startDate: new Date(dateRange.from), endDate: new Date(dateRange.to) } : null;

  const onDateRangeChange = (range: { startDate: Date; endDate: Date }) => {
    onChange({ from: range.startDate, to: range.endDate });
  };

  return (
    <div className="tw-flex tw-w-full tw-items-center tw-justify-between tw-gap-2">
      <FilterFormControl
        label="Trip Completed Within Date Range"
        pinned={isPinned}
        onPinClick={(status) => onPinChange(status)}
      >
        <div className="tw-w-full">
          <DateRangePicker
            onChange={onDateRangeChange}
            range={range}
            placeholder="Select a date range"
            placement={placement}
          />
        </div>
      </FilterFormControl>
    </div>
  );
}
