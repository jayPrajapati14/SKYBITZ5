import { render, screen } from "@testing-library/react";
import { Grid } from "./grid";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("Grid Component", () => {
  it("renders DataGrid with default settings", () => {
    render(<Grid id="test-grid" rows={[]} columns={[]} />);

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();
  });

  it("renders a custom header when header prop is passed", () => {
    const headerContent = <div>Custom Header</div>;
    render(<Grid id="test-grid" rows={[]} columns={[]} header={headerContent} />);

    expect(screen.getByText("Custom Header")).toBeInTheDocument();
  });

  it("does not render a header when no header prop is passed", () => {
    render(<Grid id="test-grid" rows={[]} columns={[]} />);

    const header = screen.queryByText("Custom Header");
    expect(header).toBeNull();
  });
});
