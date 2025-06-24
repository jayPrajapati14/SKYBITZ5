import { Tile } from "@/components/tile/tile";
import { DonutChart } from "@/views/dashboards/components/donut-chart";
import { Kpi } from "@/views/dashboards/components/kpi";
import { blue } from "@mui/material/colors";
import { useMovingAssetFilters, useMovingAssetActions, useMovingAssetFiltersCounts } from "@/store/moving-asset.store";
import { FiltersTooltip } from "@/components/filters/filters-tooltip";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useGetMovingAssetsAggregate } from "../hooks/use-get-moving-assets-aggregates";
import { TileWrapper, DonutChartContainer, KpiListContainer, KpiItem } from "./tile-wrappers";

type View = Extract<ViewType, "moving-assets" | "dashboards">;
type MovingAssetsTileProps = {
  toogleFilter?: () => void;
  view: View;
  onResetFilters?: () => void;
};

export const MovingAssetsTile = ({ toogleFilter, view, onResetFilters }: MovingAssetsTileProps) => {
  const filters = useMovingAssetFilters(view === "moving-assets");
  const { asset, location, operational, sensor, display } = filters;
  const count = useMovingAssetFiltersCounts();
  const { setFilter: setViewFilter, emptyViewFilters, resetViewFilters } = useMovingAssetActions(true);
  const navigate = useNavigate();

  const onDrillInToView = (cargoStatuses: CargoStatus[], volumetricStatuses: VolumetricStatus[]) => {
    emptyViewFilters();
    resetViewFilters();
    setViewFilter("sensor", "cargoStatuses", cargoStatuses);
    setViewFilter("sensor", "volumetricStatuses", volumetricStatuses);
    navigate("/ng/moving-assets");
  };

  const idleAssetAggregates = useGetMovingAssetsAggregate({
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
    assetLocationType: operational.assetLocationType ?? "ANYWHERE",
  });

  const emptyAssets = idleAssetAggregates.data?.empty ?? 0;
  const partiallyLoadedAssets = idleAssetAggregates.data?.partiallyLoaded ?? 0;
  const loadedAssets = idleAssetAggregates.data?.loaded ?? 0;
  const otherAssets = idleAssetAggregates.data?.other ?? 0;
  const totalAssets = idleAssetAggregates.data?.total ?? 0;
  const totalOtherAssets = otherAssets + partiallyLoadedAssets;

  const dataset = [
    { label: "Moving, Empty", value: emptyAssets, color: blue[600] },
    { label: "Moving, Loaded", value: loadedAssets, color: blue[300] },
    { label: "Other Cargo Statuses", value: totalOtherAssets, color: blue[100] },
  ];

  return (
    <Tile
      title="Moving Assets"
      toogleFilter={toogleFilter}
      tooltip={<FiltersTooltip title="Moving Assets Filters" filters={filters as MovingAssetFilters} />}
      onResetFilters={onResetFilters}
      count={count.total}
    >
      <TileWrapper>
        <Button
          className="tw-m-0 tw-w-full !tw-p-0 tw-text-inherit hover:tw-bg-transparent"
          disableRipple
          variant="text"
          onClick={() => onDrillInToView([], [])}
        >
          <DonutChartContainer>
            <DonutChart dataset={dataset} loading={idleAssetAggregates.isFetching}>
              <Kpi.Value value={totalAssets} color={blue[500]} />
              <div className="tw-text-sm tw-font-normal tw-capitalize tw-text-text-primary">
                <Kpi.Title title="Moving Assets" />
              </div>
            </DonutChart>
          </DonutChartContainer>
        </Button>

        <KpiListContainer>
          <Button
            onClick={() => onDrillInToView(["EMPTY"], ["EMPTY"])}
            className="tw-m-0 !tw-p-0 tw-text-left tw-text-inherit hover:tw-bg-transparent"
            disableRipple
          >
            <KpiItem>
              <Kpi
                title="Moving, Empty"
                value={emptyAssets}
                color={blue[500]}
                borderColor={blue[600]}
                loading={idleAssetAggregates.isFetching}
              />
            </KpiItem>
          </Button>
          <Button
            onClick={() => onDrillInToView(["LOADED"], ["LOADED"])}
            className="tw-m-0 !tw-p-0 tw-text-left tw-text-inherit hover:tw-bg-transparent"
            disableRipple
          >
            <KpiItem>
              <Kpi
                title="Moving, Loaded"
                value={loadedAssets}
                color={blue[500]}
                borderColor={blue[300]}
                loading={idleAssetAggregates.isFetching}
              />
            </KpiItem>
          </Button>
          <Button
            onClick={() => onDrillInToView(["UNKNOWN"], ["PARTIALLY_LOADED", "UNKNOWN"])}
            className="tw-m-0 !tw-p-0 tw-text-left tw-text-inherit hover:tw-bg-transparent"
            disableRipple
          >
            <KpiItem>
              <Kpi
                title="Moving, Other Cargo Statuses"
                value={totalOtherAssets}
                color={blue[500]}
                borderColor={blue[100]}
                loading={idleAssetAggregates.isFetching}
              />
            </KpiItem>
          </Button>
        </KpiListContainer>
      </TileWrapper>
    </Tile>
  );
};
