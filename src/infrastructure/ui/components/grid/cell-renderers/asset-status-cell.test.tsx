import { render, screen } from "@testing-library/react";
import { StatusCell } from "./asset-status-cell";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("StatusCell Component", () => {
  it("renders status cell for cargo unknown", () => {
    const sensorData: Sensor[] = [{ type: "CARGO", status: "UNKNOWN" }];
    render(<StatusCell sensors={sensorData} />);
    const element = screen.getByTestId("status-cell");
    expect(element).toBeInTheDocument();
  });

  it("renders status cell for power battery", () => {
    const sensorData: Sensor[] = [{ type: "POWER", status: "ON_BATTERY" }];
    render(<StatusCell sensors={sensorData} />);
    const element = screen.getByTestId("status-cell");
    expect(element).toBeInTheDocument();
  });
});
