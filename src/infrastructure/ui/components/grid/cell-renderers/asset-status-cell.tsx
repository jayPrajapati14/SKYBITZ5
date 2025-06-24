import { StatusCargoBare } from "@/components/status-icons/StatusCargoBare";
import { StatusCargoEmpty } from "@/components/status-icons/StatusCargoEmpty";
import { StatusCargoLoaded } from "@/components/status-icons/StatusCargoLoaded";
import { StatusCargoUnknown } from "@/components/status-icons/StatusCargoUnknown";
import { StatusContainerBare } from "@/components/status-icons/StatusContainerBare";
import { StatusContainerMounted } from "@/components/status-icons/StatusContainerMounted";
import { StatusContainerUnknown } from "@/components/status-icons/StatusContainerUnknown";
import { StatusDoorClosed } from "@/components/status-icons/StatusDoorClosed";
import { StatusDoorOpen } from "@/components/status-icons/StatusDoorOpen";
import { StatusMoreover } from "@/components/status-icons/StatusMoreover";
import { StatusMotionIdle } from "@/components/status-icons/StatusMotionIdle";
import { StatusMotionMoving } from "@/components/status-icons/StatusMotionMoving";
import { StatusPowerFault } from "@/components/status-icons/StatusPowerFault";
import { StatusPowerOnBattery } from "@/components/status-icons/StatusPowerOnBattery";
import { StatusPowerTethered } from "@/components/status-icons/StatusPowerTethered";
import { StatusTamperArmed } from "@/components/status-icons/StatusTamperArmed";
import { StatusTamperDisarmed } from "@/components/status-icons/StatusTamperDisarmed";
import { StatusTamperTampered } from "@/components/status-icons/StatusTamperTampered";
import { StatusVolumetricEmpty } from "@/components/status-icons/StatusVolumetricEmpty";
import { StatusVolumetricUnknown } from "@/components/status-icons/StatusVolumetricUnknown";
import { StatusVolumetricLoaded } from "@/components/status-icons/StatusVolumetricLoaded";
import { StatusVolumetricPartialLoaded } from "@/components/status-icons/StatusVolumetricPartialLoaded";
import { Tooltip, Zoom } from "@mui/material";
import { ReactNode, useState } from "react";

const statusToIcon: Record<string, () => ReactNode> = {
  "CARGO BARE": StatusCargoBare,
  "CARGO LOADED": StatusCargoLoaded,
  "CARGO UNKNOWN": StatusCargoUnknown,
  "CARGO EMPTY": StatusCargoEmpty,

  "CONTAINER BARE": StatusContainerBare,
  "CONTAINER MOUNTED": StatusContainerMounted,
  "CONTAINER UNKNOWN": StatusContainerUnknown,

  "DOOR CLOSED": StatusDoorClosed,
  "DOOR OPEN": StatusDoorOpen,

  "MOTION IDLE": StatusMotionIdle,
  "MOTION MOVING": StatusMotionMoving,

  "POWER FAULT": StatusPowerFault,
  "POWER ON_BATTERY": StatusPowerOnBattery,
  "POWER TETHERED": StatusPowerTethered,

  "TAMPER ARMED": StatusTamperArmed,
  "TAMPER DISARMED": StatusTamperDisarmed,
  "TAMPER TAMPERED": StatusTamperTampered,

  "VOLUMETRIC EMPTY": StatusVolumetricEmpty,
  "VOLUMETRIC UNKNOWN": StatusVolumetricUnknown,
  "VOLUMETRIC LOADED": StatusVolumetricLoaded,
  "VOLUMETRIC PARTIALLY_LOADED": StatusVolumetricPartialLoaded,
};

const sensorStatusFormatter = (sensor: Sensor, index: number) => {
  return (
    <div key={`sensor-${sensor.type}-${sensor.status}-${index}`} className="tw-text-xs tw-capitalize">
      {sensor.type.toLowerCase()}: {sensor.status.toLowerCase()}
    </div>
  );
};

export function StatusCell({ sensors }: { sensors: Sensor[] }) {
  const notDefinedSensors = sensors.filter((sensor) => !statusToIcon[sensor.type + " " + sensor.status]);
  const definedSensors = sensors.filter((sensor) => statusToIcon[sensor.type + " " + sensor.status]);

  const [showUndefinedStatuses, setShowUndefinedStatuses] = useState(false);

  const notDefinedIconTitle = showUndefinedStatuses ? (
    <div className="tw-whitespace-pre-line tw-text-left">
      {notDefinedSensors.map((sensor, index) => sensorStatusFormatter(sensor, index))}
    </div>
  ) : (
    <div className="tw-text-xs">Show {notDefinedSensors.length} more sensors</div>
  );

  return (
    <div
      data-testid="status-cell"
      className="tw-flex tw-size-full tw-items-center tw-justify-start tw-gap-1 tw-overflow-auto"
    >
      {definedSensors.map((sensor, index) => {
        const Icon = statusToIcon[sensor.type + " " + sensor.status];

        return (
          <Tooltip
            key={`sensor-${sensor.type}-${sensor.status}-${index}`}
            title={<div className="tw-text-center tw-text-xs">{sensorStatusFormatter(sensor, index)}</div>}
            placement="top"
            TransitionComponent={Zoom}
          >
            <span>
              <Icon aria-hidden={undefined} />
            </span>
          </Tooltip>
        );
      })}

      {notDefinedSensors.length > 0 && (
        <Tooltip
          key={`tooltip-moreover`}
          onClose={() => setTimeout(() => setShowUndefinedStatuses(false), 400)}
          onClick={() => setShowUndefinedStatuses(true)}
          title={notDefinedIconTitle}
          placement="top"
          TransitionComponent={Zoom}
          className="tw-cursor-pointer"
        >
          <span className="tw-text-primary">
            <StatusMoreover />
          </span>
        </Tooltip>
      )}
    </div>
  );
}
