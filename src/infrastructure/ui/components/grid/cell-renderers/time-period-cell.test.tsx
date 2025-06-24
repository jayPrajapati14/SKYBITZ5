import { render, screen } from "@testing-library/react";
import { TimePeriodCell } from "./time-period-cell";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("TimePeriodCell Component", () => {
  it("renders formatted time period", () => {
    render(<TimePeriodCell hours={49.5} status="IDLE" />);
    expect(screen.getByText("2.1")).toBeInTheDocument();
    expect(screen.getByText("d")).toBeInTheDocument();
  });

  it("renders only hours and minutes when less than a day", () => {
    render(<TimePeriodCell hours={5.5} status="MOVING" />);
    expect(screen.getByText("5.5")).toBeInTheDocument();
    expect(screen.getByText("h")).toBeInTheDocument();
  });
});
