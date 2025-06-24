import { cargoStatusesOptions } from "@/domain/contants/status";

type FilterTooltipItemProps = {
  title: string;
  value: string | number;
};

const findLabel = (sensorType: SensorType, status: string): Nullable<string> => {
  const option = cargoStatusesOptions.find((opt) => opt.sensorType === sensorType && opt.status === status);
  return option?.label ?? null;
};

function FilterTooltipItem({ title, value }: FilterTooltipItemProps) {
  return (
    <>
      <div className="tw-mt-2">{title}</div>
      <div>
        <ul className="tw-ml-3 tw-list-disc">
          <li>{value}</li>
        </ul>
      </div>
    </>
  );
}

type FiltersTooltipProps = {
  title: string;
  filters: IdleAssetFilters | MovingAssetFilters;
};

export function FiltersTooltip({ title, filters: { asset, location, sensor, operational } }: FiltersTooltipProps) {
  const tooltipValues = [
    { title: "Filter By Text Search", value: asset.byTextSearch || "" },
    { title: "Landmark Name", value: location.names?.map((landmark) => landmark.name).join(", ") ?? "" },
    { title: "Landmark Group", value: location.groups?.map((landmark) => landmark.name).join(", ") ?? "" },
    { title: "Landmark Type", value: location.types?.map((landmark) => landmark.name).join(", ") ?? "" },
    { title: "Asset Type", value: asset.types?.map((asset) => asset.name).join(", ") ?? "" },
    { title: "Asset Id", value: asset.ids?.map((asset) => asset.assetId).join(", ") ?? "" },
    { title: "Exclude Asset Id", value: asset.excludedIds?.map((asset) => asset.assetId).join(", ") ?? "" },
    { title: "Country", value: location.countries?.map((country) => country.name).join(", ") ?? "" },
    { title: "State", value: location.states?.map((state) => state.name).join(", ") ?? "" },
    { title: "Zip Code", value: location.zipCode ?? "" },
    {
      title: "Cargo Sensor Status",
      value: sensor.cargoStatuses?.map((status) => findLabel("CARGO", status)).join(", ") ?? "",
    },
    {
      title: "Volumetric Cargo Sensor Status",
      value: sensor.volumetricStatuses?.map((status) => findLabel("VOLUMETRIC", status)).join(", ") ?? "",
    },
    { title: "Motion Status", value: sensor.motionStatuses?.map((status) => status).join(", ") ?? "" },
    {
      title: "Asset at landmarks",
      value: operational.assetLocationType
        ? {
            ANYWHERE: "",
            AT_LANDMARK: "Assets only at landmarks",
            NOT_AT_LANDMARK: "Assets not at landmarks",
          }[operational.assetLocationType]
        : "",
    },
    {
      title: "Idle Time",
      value: "idleTime" in operational && operational.idleTime ? `${operational.idleTime} Hours` : "",
    },
    { title: "Last Reported", value: operational.lastReported ? `${operational.lastReported} Days` : "" },
  ];

  return (
    <div>
      <div className="tw-mb-4 tw-uppercase">{title}</div>
      {tooltipValues.map(
        ({ title, value }) => Boolean(value) && <FilterTooltipItem key={title} title={title} value={value} />
      )}
    </div>
  );
}
