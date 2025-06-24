import { render, screen } from "@testing-library/react";
import { LastReportedCell } from "./last-reported-cell";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/domain/utils/datetime", () => ({
  dateFormatter: () => {
    return "2024, November 7";
  },
}));

describe("LastReportedCell Component", () => {
  it("renders landmark and formatted date", () => {
    const landmark = "Location A";
    const arrivedAt = new Date();

    render(<LastReportedCell landmark={landmark} arrivedAt={arrivedAt} />);

    expect(screen.getByText("Location A")).toBeInTheDocument();
    expect(screen.getByText("2024, November 7")).toBeInTheDocument();
  });
});
