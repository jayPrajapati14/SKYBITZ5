import { Tile } from "@/components/tile/tile";
import { Kpi } from "@/views/dashboards/components/kpi";
import { blue, grey } from "@mui/material/colors";

type AccruedDistanceTileProps = {
  accruedDistance: number;
  accruedAssets: number;
};

export const AccruedDistanceTile = ({ accruedDistance, accruedAssets }: AccruedDistanceTileProps) => {
  return (
    <Tile title="Accrued Distance (Mileage)" className="tw-max-w-[500px]" link="/accrued-distance">
      <div className="tw-mt-8 tw-flex tw-gap-2">
        <Kpi title="Accrued Distance (miles)" value={accruedDistance} color={grey[700]} borderColor={"transparent"} />
        <Kpi title="Accrued Assets" value={accruedAssets} color={blue[500]} borderColor={"transparent"} />
      </div>
    </Tile>
  );
};
