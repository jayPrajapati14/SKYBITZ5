import { ReactNode } from "react";
import { Button } from "@mui/material";
import { blue } from "@mui/material/colors";
import clsx from "clsx";

type LandmarkStatesProps = {
  landmarkStats: LandmarkAssetStats;
  onDrillInToView: (statuses: CargoStatus[], volumetricStatuses: VolumetricStatus[], landmarks: Landmark[]) => void;
};

export const LandmarkStatsHeading = () => {
  return (
    <>
      <div className="tw-flex tw-items-end tw-pb-1 tw-text-xs tw-text-text-secondary">Yard</div>
      <div className="tw-flex tw-items-end tw-justify-center tw-pb-1 tw-text-xs tw-text-text-secondary">
        Asset <br /> Count
      </div>
      <div className="tw-flex tw-items-end tw-justify-center tw-pb-1 tw-text-xs tw-text-text-secondary">
        Empty <br /> Count
      </div>
      <div className="tw-flex tw-items-end tw-pb-1 tw-text-xs tw-text-text-secondary">Empty Percentage</div>
    </>
  );
};

type LandmarkItemProps = {
  title: string | number;
  landmarkStats: LandmarkAssetStats;
  cargoStatuses: CargoStatus[];
  volumetricStatuses: VolumetricStatus[];
  onDrillInToView: (statuses: CargoStatus[], volumetricStatuses: VolumetricStatus[], landmarks: Landmark[]) => void;
  contentAlign?: "left" | "center" | "right";
};

const LandmarkStatsItem = ({
  title,
  cargoStatuses,
  volumetricStatuses,
  landmarkStats,
  onDrillInToView,
  contentAlign,
}: LandmarkItemProps) => {
  const style = `!tw-block !tw-min-w-full ${contentAlign ? `tw-text-${contentAlign}` : ""} !tw-px-0 !tw-text-xs !tw-font-normal !tw-capitalize hover:tw-bg-transparent`;
  return (
    <div className="tw-py-1 tw-text-xs tw-text-text-primary">
      <Button
        variant="text"
        disableRipple
        className={style}
        onClick={() => {
          onDrillInToView(cargoStatuses, volumetricStatuses, [landmarkStats]);
        }}
        fullWidth
      >
        {title}
      </Button>
    </div>
  );
};

export const LandmarkStatsRow = ({ landmarkStats, onDrillInToView }: LandmarkStatesProps): ReactNode => {
  const percentage: number = (landmarkStats.emptyAssets / landmarkStats.totalAssets) * 100;

  const barStyle = {
    "--width": `${percentage}%`,
    "--background": blue[600],
    backgroundSize: "cover",
    backgroundImage:
      "linear-gradient(to right, var(--background) 0, var(--background) var(--width), #eaeaea var(--width), #eaeaea 100%)",
  } as React.CSSProperties;

  const labelThreshold = 80;

  const textStyle: React.CSSProperties =
    percentage < labelThreshold
      ? {
          left: `${percentage + 2}%`,
          width: "auto",
        }
      : {
          background: "inherit",
          backgroundPosition: "3px",
          backgroundClip: "text",
          filter: "sepia(5) saturate(100) invert(1) grayscale(1) contrast(9)",
        };
  return (
    <>
      <LandmarkStatsItem
        title={landmarkStats.name ?? ""}
        cargoStatuses={[]}
        volumetricStatuses={[]}
        landmarkStats={landmarkStats}
        onDrillInToView={onDrillInToView}
        contentAlign="left"
      />
      <LandmarkStatsItem
        title={landmarkStats.totalAssets ?? 0}
        cargoStatuses={[]}
        volumetricStatuses={[]}
        landmarkStats={landmarkStats}
        onDrillInToView={onDrillInToView}
        contentAlign="center"
      />
      <LandmarkStatsItem
        title={landmarkStats.emptyAssets ?? 0}
        cargoStatuses={["EMPTY"]}
        volumetricStatuses={["EMPTY"]}
        landmarkStats={landmarkStats}
        onDrillInToView={onDrillInToView}
        contentAlign="center"
      />
      <div className="tw-py-1">
        <div
          className="tw-relative tw-flex tw-h-6 tw-items-center tw-justify-end tw-rounded-sm tw-pr-[3px]"
          style={barStyle}
        >
          <div
            className={clsx(
              "tw-absolute tw-w-full tw-text-right tw-text-[10px] tw-font-medium",
              percentage < labelThreshold ? "tw-text-black" : "tw-bg-clip-text tw-text-transparent"
            )}
            style={textStyle}
          >
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>
    </>
  );
};
