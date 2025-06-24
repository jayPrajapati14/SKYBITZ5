import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { Count } from "@/components/count/count";
import { AssetFilters } from "./asset-filters";
import { useAccruedDistanceFiltersCounts } from "@/store/accrued-distance.store";
import { OperationalFilters } from "@/views/accrued-distance/components/operational-filters";

type View = Extract<ViewType, "accrued-distance" | "dashboards">;

type FilterInfo = {
  id: keyof AccruedDistanceFilters;
  label: string;
  component: (view: View) => React.ReactNode;
};

const FILTERS: FilterInfo[] = [
  { id: "asset", label: "Asset Filters", component: (view: View) => <AssetFilters view={view} /> },
  {
    id: "operational",
    label: "Operational Filters",
    component: (view: View) => <OperationalFilters view={view} />,
  },
];

export function AccruedDistanceFiltersPanel({ view }: { view: View }) {
  const baseCounts = useAccruedDistanceFiltersCounts();
  const viewCounts = useAccruedDistanceFiltersCounts(view === "accrued-distance");

  const counts = view === "accrued-distance" ? viewCounts : baseCounts;

  return FILTERS.map(({ id, label, component: Component }) => (
    <Accordion key={id} defaultExpanded slotProps={{ transition: { unmountOnExit: true } }}>
      <AccordionSummary expandIcon={<ExpandMore />} aria-controls={`${id}-filters-control`} id={id}>
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-text-sm tw-font-medium">{label}</div>
          <Count count={counts[id]} />
        </div>
      </AccordionSummary>
      <AccordionDetails>{Component(view)}</AccordionDetails>
    </Accordion>
  ));
}
