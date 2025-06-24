import { dateFormatter } from "@/domain/utils/datetime";

type CompactDateCellProps = {
  date: Nullable<Date>;
  timezone?: Nullable<string>;
};

export function CompactDateCell({ date, timezone }: CompactDateCellProps) {
  if (!date) return "N/A";

  return (
    <div className="tw-flex tw-flex-wrap tw-gap-1">
      {dateFormatter(date, timezone)
        .split(", ")
        .map((part, index) => (
          <div key={index}>{part}</div>
        ))}
    </div>
  );
}
