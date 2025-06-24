export const cargoStatusesOptions: { sensorType: SensorType; status: string; label: string }[] = [
  { sensorType: "CARGO", status: "EMPTY", label: "Empty" },
  { sensorType: "CARGO", status: "LOADED", label: "Loaded" },
  { sensorType: "CARGO", status: "UNKNOWN", label: "Unknown" },
  { sensorType: "VOLUMETRIC", status: "EMPTY", label: "Empty*" },
  { sensorType: "VOLUMETRIC", status: "PARTIALLY_LOADED", label: "Partial*" },
  { sensorType: "VOLUMETRIC", status: "LOADED", label: "Full*" },
  { sensorType: "VOLUMETRIC", status: "UNKNOWN", label: "Unknown*" },
];
