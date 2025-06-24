import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Count } from "@/components/count/count";
import { useGenericAssetFiltersCounts } from "@/store/generic-asset.store";
import { AssetFilters } from "./asset-filters";
import { OperationalFilters } from "./operational-filters";
import { LocationFilters } from "./location-filters";
import { SensorFilters } from "./sensor-filters";
import { AssetTextSearchFilter } from "./asset-text-search";
import { Feature } from "@/components/feature-flag";

type View = Extract<ViewType, "generic-assets" | "dashboards">;

type FilterInfo = {
  id: keyof GenericAssetFilters;
  label: string;
  component: (view: View) => React.ReactNode;
};

const FILTERS: FilterInfo[] = [
  {
    id: "asset",
    label: "Asset Filters",
    component: (view: View) => <AssetFilters view={view} />,
  },
  {
    id: "location",
    label: "Location Filters",
    component: (view: View) => <LocationFilters view={view} />,
  },
  {
    id: "sensor",
    label: "Sensor Filters",
    component: (view: View) => <SensorFilters view={view} />,
  },
  {
    id: "operational",
    label: "Operational Filters",
    component: (view: View) => <OperationalFilters view={view} />,
  },
];

export function GenericAssetsFiltersPanel({ view }: { view: View }) {
  const baseCounts = useGenericAssetFiltersCounts();
  const viewCounts = useGenericAssetFiltersCounts(view === "generic-assets");

  const counts = view === "generic-assets" ? viewCounts : baseCounts;

  return (
    <>
      <Feature flag="generic-assets" option="showTextSearch">
        <div className="tw-p-4">
          <AssetTextSearchFilter view={view} />
        </div>
      </Feature>
      {FILTERS.map(({ id, label, component: Component }) => (
        <Accordion key={id} defaultExpanded slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`${id}-filters-control`} id={id}>
            <div className="tw-flex tw-items-center tw-gap-2">
              <div className="tw-text-sm tw-font-normal">{label}</div>
              <Count count={counts[id]} />
            </div>
          </AccordionSummary>
          <AccordionDetails>{Component(view)}</AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
