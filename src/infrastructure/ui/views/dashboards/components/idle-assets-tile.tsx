import { Tile } from "@/components/tile/tile";
import { DonutChart } from "@/views/dashboards/components/donut-chart";
import { Kpi } from "@/views/dashboards/components/kpi";
import { blue } from "@mui/material/colors";
import { useIdleAssetFilters, useIdleAssetActions, useIdleAssetFiltersCounts } from "@/store/idle-asset.store";
import { FiltersTooltip } from "@/components/filters/filters-tooltip";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useGetIdleAssetsAggregate } from "../hooks/use-get-idle-assets-aggregates";
import { routeConfigs } from "@/infrastructure/ui/routes";
import { TileWrapper, DonutChartContainer, KpiListContainer, KpiItem } from "./tile-wrappers";

type View = Extract<ViewType, "idle-assets" | "dashboards">;
type IdleAssetsTileProps = {
  toogleFilter?: () => void;
  view: View;
  onResetFilters?: () => void;
};

export const IdleAssetsTile = ({ toogleFilter, view, onResetFilters }: IdleAssetsTileProps) => {
  const filters = useIdleAssetFilters(view === "idle-assets");
  const { asset, location, operational, sensor, display } = filters;
  const count = useIdleAssetFiltersCounts();
  const { setFilter: setViewFilter, emptyViewFilters, resetViewFilters } = useIdleAssetActions(true);
  const navigate = useNavigate();

  const onDrillInToView = (cargoStatuses: CargoStatus[], volumetricStatuses: VolumetricStatus[]) => {
    emptyViewFilters();
    resetViewFilters();
    setViewFilter("sensor", "cargoStatuses", cargoStatuses);
    setViewFilter("sensor", "volumetricStatuses", volumetricStatuses);
    setViewFilter("sensor", "motionStatuses", ["IDLE"]);
    setViewFilter("operational", "lastReported", 28);

    navigate(routeConfigs.idleAssets.path);
  };

  const idleAssetAggregates = useGetIdleAssetsAggregate({
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
    idleTime: operational.idleTime,
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
    { label: "Idle, Empty", value: emptyAssets, color: blue[600] },
    { label: "Idle, Loaded", value: loadedAssets, color: blue[300] },
    { label: "Other Cargo Statuses", value: totalOtherAssets, color: blue[100] },
  ];

  return (
    <Tile
      title="Idle Assets"
      toogleFilter={toogleFilter}
      tooltip={<FiltersTooltip title="Idle Assets Filters" filters={filters} />}
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
                <Kpi.Title title="Idle Assets" />
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
                title="Idle, Empty"
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
                title="Idle, Loaded"
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
                title="Idle, Other Cargo Statuses"
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
