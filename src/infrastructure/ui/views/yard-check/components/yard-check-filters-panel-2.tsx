import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Count } from "@/components/count/count";
import { useYardCheckFiltersCounts } from "@/store/yard-check.store";
import { AssetFilters } from "./asset-filters";
import { OperationalFilters } from "./operational-filters";
import { LocationFilters } from "./location-filters-2";
import { SensorFilters } from "@/views/yard-check/components/sensor-filters-2";
import { AssetTextSearchFilter } from "./asset-text-search";

type View = Extract<ViewType, "yard-check" | "dashboards">;

type FilterInfo = {
  id: keyof YardCheckFilters;
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

export function YardCheckFiltersPanel({ view }: { view: View }) {
  const baseCounts = useYardCheckFiltersCounts();
  const viewCounts = useYardCheckFiltersCounts(view === "yard-check");

  const counts = view === "yard-check" ? viewCounts : baseCounts;

  return (
    <>
      <div className="tw-p-4">
        <AssetTextSearchFilter view={view} />
      </div>
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
