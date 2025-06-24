import { render, screen } from "@testing-library/react";
import { CompactDateCell } from "./compact-date-cell";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/domain/utils/datetime", () => ({
  dateFormatter: () => {
    return "2024, November 7";
  },
}));

describe("CompactDateCell Component", () => {
  it("renders formatted date", () => {
    const testDate = new Date();
    render(<CompactDateCell date={testDate} />);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("November 7")).toBeInTheDocument();
  });
});
