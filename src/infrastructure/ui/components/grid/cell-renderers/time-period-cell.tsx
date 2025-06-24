import Tooltip from "@mui/material/Tooltip";
import { Navigation, PauseCircleOutline } from "@mui/icons-material";

type MotionStatus = "IDLE" | "MOVING";

const getIdleTimeColour = (hours: number): string => {
  if (hours > 168) return "tw-text-red-500"; // 7 days
  if (hours > 72) return "tw-text-orange-400"; // 3 days
  return "tw-text-blue-400"; // 0-3 days
};

const formatNumber = (value: number): string => {
  const isWholeNumber = Number.isInteger(value) || value.toFixed(1).endsWith(".0");
  return value.toLocaleString("en-US", {
    minimumFractionDigits: isWholeNumber ? 0 : 1,
    maximumFractionDigits: 1,
  });
};

export const formatHours = (hours: number, status: MotionStatus): { number: string; unit: string } => {
  if (status === "IDLE") {
    const days = hours / 24;
    return { number: formatNumber(days), unit: "d" };
  }
  if (status === "MOVING") {
    return { number: formatNumber(hours), unit: "h" };
  }
  return { number: hours.toString(), unit: "" };
};

const StatusIcon = ({ status }: { status: MotionStatus }): React.ReactNode => {
  const isMoving = status === "MOVING";
  const Icon = isMoving ? Navigation : PauseCircleOutline;
  const tooltipText = isMoving ? "Motion: Moving" : "Motion: Idle";

  return (
    <Tooltip title={tooltipText} placement="top">
      <Icon className={`tw-mr-1 !tw-text-base tw-text-text-secondary ${isMoving ? "tw-rotate-90" : ""}`} />
    </Tooltip>
  );
};

interface TimePeriodCellProps {
  hours: number;
  status: MotionStatus;
}

export function TimePeriodCell({ hours, status }: TimePeriodCellProps) {
  const { number, unit } = formatHours(hours, status);
  const textColorClass = status === "IDLE" ? getIdleTimeColour(hours) : "";

  return (
    <div className="tw-justify-left tw-flex tw-items-center">
      {hours > 0 && <StatusIcon status={status} />}
      <span className={textColorClass}>{number}</span>
      {unit && (
        <span className="tw-relative tw-top-px tw-ml-px tw-text-[10px] tw-font-normal tw-text-text-secondary">
          {unit}
        </span>
      )}
    </div>
  );
}
