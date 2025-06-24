import { NavBar } from "@/components/navbar/navbar";
import { Layout } from "@/views/layout/layout";
import { useUiStore } from "@/store/ui.store";
import { IdleAssetsTile } from "@/views/dashboards/components/idle-assets-tile";
import { MovingAssetsTile } from "@/views/dashboards/components/moving-assets-tile";
// import { AccruedDistanceTile } from "@/views/dashboards/components/accrued-distance-tile";
import { YardCheckTile } from "@/views/dashboards/components/yard-check-tile";
import { Feature } from "@/components/feature-flag";
import { useState } from "react";
import { Filters } from "@/components/filters/filters";
import { YardCheckFiltersPanel } from "@/views/yard-check/components/yard-check-filters-panel-2";
import { IdleAssetsFiltersPanel } from "@/views/idle-assets/components/idle-assets-filters-panel";
import { useIdleAssetFiltersCounts, useIdleAssetActions } from "@/store/idle-asset.store";
import { useYardCheckFiltersCounts, useYardCheckActions } from "@/store/yard-check.store";
import { MovingAssetsFiltersPanel } from "@/views/moving-assets/components/moving-assets-filters-panel";
import { useMovingAssetFiltersCounts, useMovingAssetActions } from "@/store/moving-asset.store";

const DASHBOARDS_APP_LINKS = {
  left: [{ label: "Operations", path: "/ng/dashboards" }],
};

export const Dashboards = () => {
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  const [activeFiltersPanel, setActiveFiltersPanel] = useState<"yard-check" | "idle-assets" | "moving-assets">(
    "yard-check"
  );
  const idleAssetsCount = useIdleAssetFiltersCounts();
  const { resetBaseFilters: resetIdleAssetFilters } = useIdleAssetActions();
  const movingAssetsCount = useMovingAssetFiltersCounts();
  const { resetBaseFilters: resetMovingAssetFilters } = useMovingAssetActions();
  const yardCheckCount = useYardCheckFiltersCounts();
  const { resetBaseFilters: resetYardCheckFilters } = useYardCheckActions();

  const onShowIdleAssetsFilters = () => {
    setActiveFiltersPanel("idle-assets");
    toggleDrawer();
  };

  const onShowYardCheckFilters = () => {
    setActiveFiltersPanel("yard-check");
    toggleDrawer();
  };

  const onShowMovingAssetsFilters = () => {
    setActiveFiltersPanel("moving-assets");
    toggleDrawer();
  };

  return (
    <>
      <Layout.Title>Dashboards</Layout.Title>
      <Layout.Controls>
        <NavBar
          leftLinks={DASHBOARDS_APP_LINKS.left}
          rightLinks={[]}
          showFilters={false}
          filtersCount={0}
          toggleDrawer={toggleDrawer}
        />
      </Layout.Controls>

      <Layout.Content>
        <div className="tw-mx-auto tw-grid tw-max-w-4xl lg:tw-grid-cols-2">
          <div className="tw-mx-auto tw-w-full">
            <Feature flag="yard-check-dashboard">
              <YardCheckTile toogleFilter={onShowYardCheckFilters} view="dashboards" />
            </Feature>
          </div>
          <div className="tw-mx-auto tw-w-full">
            <Feature flag="idle-assets-dashboard">
              <IdleAssetsTile toogleFilter={onShowIdleAssetsFilters} view="dashboards" />
            </Feature>
            <div className="tw-mt-4">
              <Feature flag="moving-assets-dashboard">
                <MovingAssetsTile toogleFilter={onShowMovingAssetsFilters} view="dashboards" />
              </Feature>
            </div>
          </div>
        </div>

        <Filters>
          {activeFiltersPanel === "yard-check" && (
            <Filters.Panel
              count={yardCheckCount.total}
              onResetFilters={() => resetYardCheckFilters()}
              title="Yard Check Filters"
            >
              <YardCheckFiltersPanel view="dashboards" />
            </Filters.Panel>
          )}

          {activeFiltersPanel === "idle-assets" && (
            <Filters.Panel
              count={idleAssetsCount.total}
              onResetFilters={() => resetIdleAssetFilters()}
              title="Idle Assets Filters"
            >
              <IdleAssetsFiltersPanel view="dashboards" />
            </Filters.Panel>
          )}

          {activeFiltersPanel === "moving-assets" && (
            <Filters.Panel
              count={movingAssetsCount.total}
              onResetFilters={() => resetMovingAssetFilters()}
              title="Moving Assets Filters"
            >
              <MovingAssetsFiltersPanel view="dashboards" />
            </Filters.Panel>
          )}
        </Filters>
      </Layout.Content>
    </>
  );
};
