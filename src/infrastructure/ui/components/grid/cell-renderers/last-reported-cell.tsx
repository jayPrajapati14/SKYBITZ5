import { dateFormatter } from "@/domain/utils/datetime";
import { LocationCell } from "@/components/grid/cell-renderers/location-cell";

export function LastReportedCell({
  landmark,
  arrivedAt,
  timezone,
}: {
  landmark: Nullable<string>;
  arrivedAt: Nullable<Date>;
  timezone?: Nullable<string>;
}) {
  return (
    <div className="tw-flex tw-h-full tw-flex-col tw-justify-center">
      <div className="tw-text-sm">
        <LocationCell landmarkName={landmark} type={"CUSTOM"} />
      </div>
      {arrivedAt ? <div className="tw-text-sm tw-text-gray-500">{dateFormatter(arrivedAt, timezone)}</div> : null}
    </div>
  );
}
