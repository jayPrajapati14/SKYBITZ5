import { Tile } from "@/components/tile/tile";
import { Kpi } from "@/views/dashboards/components/kpi";
import { blue } from "@mui/material/colors";
import { FiltersTooltip } from "@/components/filters/filters-tooltip";
import { useYardCheckFilters, useYardCheckActions, useYardCheckFiltersCounts } from "@/store/yard-check.store";
import { Button, Skeleton } from "@mui/material";
import { useGetYardCheckAssetsAggregate } from "../hooks/use-get-yard-check-aggregates";
import { useNavigate } from "react-router-dom";
import { LandmarkStatsHeading, LandmarkStatsRow } from "./landmark-stats";

type KpiButtonProps = {
  tile: string;
  value: number;
  loading: boolean;
  cargoStatuses: CargoStatus[];
  volumetricStatuses: VolumetricStatus[];
  onDrillInToView: (
    cargoStatuses: CargoStatus[],
    volumetricStatuses: VolumetricStatus[],
    landmarks: Landmark[]
  ) => void;
  landmarks: LandmarkAssetStats[];
};

const KpiButton = ({
  tile,
  value,
  loading,
  onDrillInToView,
  landmarks,
  cargoStatuses,
  volumetricStatuses,
}: KpiButtonProps) => {
  return (
    <>
      <Button
        onClick={() => {
          onDrillInToView(cargoStatuses, volumetricStatuses, landmarks);
        }}
        className="tw-m-0 !tw-p-0 tw-text-left tw-text-inherit hover:tw-bg-transparent"
        disableRipple
      >
        <div className="tw-w-full tw-text-sm tw-font-normal tw-capitalize tw-text-text-primary">
          <Kpi title={tile} value={value} color={blue[500]} borderColor={"transparent"} loading={loading} />
        </div>
      </Button>
    </>
  );
};

type View = Extract<ViewType, "yard-check" | "dashboards">;
type YardCheckAssetsTileProps = {
  toogleFilter?: () => void;
  view: View;
  onResetFilters?: () => void;
};

export const YardCheckTile = ({ toogleFilter, view, onResetFilters }: YardCheckAssetsTileProps) => {
  const filters = useYardCheckFilters(view === "yard-check");
  const { asset, location, operational, sensor, display } = filters;
  const count = useYardCheckFiltersCounts();

  const YardCheckAssetAggregates = useGetYardCheckAssetsAggregate({
    landmarkIds: location.names?.map((item) => item.id) ?? [],
    landmarkGroups: location.groups?.map((item) => item.id) ?? [],
    landmarkTypes: location.types?.map((item) => item.id) ?? [],
    excludedAssetIds: asset.excludedIds?.map((item) => item.id) ?? [],
    ids: asset.ids?.map((item) => item.id) ?? [],
    types: asset.types?.map((item) => item.id) ?? [],
    countries: location.countries?.map((item) => item.id) ?? [],
    states: location.states?.map((item) => item.id) ?? [],
    zipCode: location.zipCode,
    lastReported: operational.lastReported,
    cargoStatuses: sensor.cargoStatuses,
    volumetricStatuses: sensor.volumetricStatuses,
    motionStatuses: sensor.motionStatuses,
    sortBy: display?.sortBy,
    byTextSearch: asset.byTextSearch,
  });

  const landmarks = YardCheckAssetAggregates?.data?.landmarks ?? [];
  const landmarksCount = YardCheckAssetAggregates.data?.totalLandmarks ?? 0;
  const emptyAssets = YardCheckAssetAggregates?.data?.emptyAssets ?? 0;

  const { setFilter: setViewFilter, emptyViewFilters, resetViewFilters } = useYardCheckActions(true);
  const navigate = useNavigate();

  const onDrillInToView = (
    cargoStatuses: CargoStatus[],
    volumetricStatuses: VolumetricStatus[],
    landmarks: Landmark[]
  ) => {
    emptyViewFilters();
    resetViewFilters();
    setViewFilter("sensor", "cargoStatuses", cargoStatuses);
    setViewFilter("location", "names", landmarks);
    setViewFilter("sensor", "volumetricStatuses", volumetricStatuses);
    navigate("/ng/yard-check-2");
  };

  return (
    <Tile
      title="Yard Check"
      toogleFilter={toogleFilter}
      tooltip={<FiltersTooltip title="Yard Check Filters" filters={filters} />}
      onResetFilters={onResetFilters}
      count={count.total}
    >
      <div className="tw-grid tw-grid-cols-2 tw-gap-2">
        <KpiButton
          tile="Empty Assets"
          cargoStatuses={["EMPTY"]}
          value={emptyAssets}
          loading={YardCheckAssetAggregates.isFetching}
          onDrillInToView={onDrillInToView}
          volumetricStatuses={["EMPTY"]}
          landmarks={[]}
        />
        <KpiButton
          tile="Yards"
          cargoStatuses={[]}
          volumetricStatuses={[]}
          value={landmarksCount}
          loading={YardCheckAssetAggregates.isFetching}
          onDrillInToView={onDrillInToView}
          landmarks={landmarks}
        />
      </div>
      <div className="tw-mt-3 tw-text-center tw-text-[10px] tw-font-medium tw-text-text-secondary">
        Empty Assets are empty loads reported by cargo and volumetric sensors
      </div>
      <h1 className="tw-mt-3 tw-p-1.5 tw-text-center tw-text-sm tw-font-medium tw-text-text-secondary">
        Top Most Empty Assets in Yards
      </h1>
      <div className="tw-grid tw-max-h-[200px] tw-grid-cols-[35%,15%,15%,35%] tw-overflow-auto tw-rounded-md tw-border tw-px-1.5 tw-py-1">
        <LandmarkStatsHeading />
        {YardCheckAssetAggregates.isFetching ? (
          <Skeleton height="100%" width="100%" className="tw-col-span-4"></Skeleton>
        ) : landmarks.length > 0 && YardCheckAssetAggregates.isFetched ? (
          landmarks.map((item) => (
            <LandmarkStatsRow key={`${item.id}`} landmarkStats={item} onDrillInToView={onDrillInToView} />
          ))
        ) : (
          <div className="tw-col-span-4 tw-text-center tw-text-sm tw-text-gray-500">
            The filters applied don't return any results
          </div>
        )}
      </div>
    </Tile>
  );
};
