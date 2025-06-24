import { z } from "zod";

export const SensorDtoSchema = z.union([
  z.object({
    sensorType: z.literal("MOTION"),
    sensorValue: z.enum(["CLOSED", "IDLE", "MOVING", "START", "STOP", "NO_ANSWER", "UNKNOWN"]),
  }),
  z.object({
    sensorType: z.literal("DOOR"),
    sensorValue: z.enum(["OPEN", "CLOSED", "UNKNOWN"]),
  }),
  z.object({
    sensorType: z.literal("POWER"),
    sensorValue: z.enum(["ON_BATTERY", "POWER_OFF", "POWER_ON", "UNKNOWN"]),
  }),
  z.object({
    sensorType: z.literal("CONTAINER"),
    sensorValue: z.enum(["DISABLED", "BARE", "DISMOUNTED", "ERROR", "MOUNTED", "NO_ANSWER", "UNKNOWN"]),
  }),
  z.object({
    sensorType: z.literal("CARGO"),
    sensorValue: z.enum(["LOADED", "MOUNTED", "PARTIALLY_LOADED", "BARE", "EMPTY", "FULL", "UNKNOWN", "DISABLED"]),
  }),
  z.object({
    sensorType: z.literal("TAMPER"),
    sensorValue: z.enum(["DISARMED", "ALERT", "ARMED", "UNKNOWN"]),
  }),
  z.object({
    sensorType: z.literal("VOLUMETRIC"),
    sensorValue: z.enum(["EMPTY", "PARTIALLY_LOADED", "LOADED", "UNKNOWN"]),
  }),
]);

export type SensorDto = z.infer<typeof SensorDtoSchema>;
