export const SENSOR_TYPE_ORDER: Record<SensorType, number> = {
  MOTION: 0,
  CARGO: 1,
  VOLUMETRIC: 2,
  CONTAINER: 3,
  DOOR: 4,
  POWER: 5,
  TAMPER: 6,
};

declare global {
  export type SensorType = "CARGO" | "CONTAINER" | "DOOR" | "POWER" | "TAMPER" | "MOTION" | "VOLUMETRIC";

  export type Sensor =
    | {
        type: "CARGO";
        status: "LOADED" | "MOUNTED" | "PARTIALLY_LOADED" | "BARE" | "EMPTY" | "FULL" | "UNKNOWN" | "DISABLED";
      }
    | { type: "CONTAINER"; status: "DISABLED" | "BARE" | "DISMOUNTED" | "ERROR" | "MOUNTED" | "NO_ANSWER" | "UNKNOWN" }
    | { type: "DOOR"; status: "OPEN" | "CLOSED" | "UNKNOWN" }
    | { type: "POWER"; status: "ON_BATTERY" | "POWER_OFF" | "POWER_ON" | "UNKNOWN" }
    | { type: "TAMPER"; status: "DISARMED" | "ALERT" | "ARMED" | "UNKNOWN" }
    | { type: "MOTION"; status: "CLOSED" | "IDLE" | "MOVING" | "START" | "STOP" | "NO_ANSWER" | "UNKNOWN" }
    | { type: "VOLUMETRIC"; status: "EMPTY" | "PARTIALLY_LOADED" | "LOADED" | "UNKNOWN" };

  export type CargoStatus = Extract<Sensor, { type: "CARGO" }>["status"];
  export type MotionStatus = Extract<Sensor, { type: "MOTION" }>["status"];
  export type VolumetricStatus = Extract<Sensor, { type: "VOLUMETRIC" }>["status"];
}
