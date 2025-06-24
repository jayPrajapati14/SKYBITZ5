import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React, { ReactNode } from "react";
import { Filters } from "./filters";
import { FilterDropdownContext } from "./filter-dropdown";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { Button } from "@mui/material";
import { useUiStore } from "@/store/ui.store";
import { AccruedDistanceFiltersPanel } from "@/views/accrued-distance/components/accrued-distance-filters-panel";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/infrastructure/query-client";
import { YardCheckFiltersPanel } from "@/views/yard-check/components/yard-check-filters-panel";

interface MockFilterDropdownProviderProps {
  children: ReactNode;
}

const MockFilterDropdownProvider: React.FC<MockFilterDropdownProviderProps> = ({ children }) => {
  return (
    <FilterDropdownContext.Provider
      value={{
        open: true,
        anchorEl: null,
        handleClick: vi.fn(),
        handleClose: vi.fn(),
      }}
    >
      {children}
    </FilterDropdownContext.Provider>
  );
};

const ButtonComponent = () => {
  const toggleDrawer = useUiStore((state) => state.toggleDrawer);
  return <Button onClick={toggleDrawer}>Show Filter</Button>;
};

describe("Filters Component", () => {
  it("renders children correctly", () => {
    render(
      <Filters>
        <div data-testid="test-child">Test Child</div>
      </Filters>
    );

    const childElement = screen.getByTestId("test-child");
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent("Test Child");
  });

  it("contains nested components", () => {
    render(
      <Filters>
        <Filters.Bar>
          <div>Bar Content</div>
        </Filters.Bar>
        <MockFilterDropdownProvider>
          <Filters.Dropdown>
            <div>Dropdown Content</div>
          </Filters.Dropdown>
          <Filters.Popover>
            <div>Popover Content</div>
          </Filters.Popover>
          <Filters.Chip label="Test Chip" count={0} />
        </MockFilterDropdownProvider>
      </Filters>
    );

    expect(screen.getByText("Bar Content")).toBeInTheDocument();
    expect(screen.getByText("Dropdown Content")).toBeInTheDocument();
    expect(screen.getByText("Test Chip")).toBeInTheDocument();
  });

  it("opens popover when dropdown is clicked", () => {
    const handleClose = vi.fn();

    render(
      <Filters>
        <Filters.Bar>
          <div>Bar Content</div>
        </Filters.Bar>
        <MockFilterDropdownProvider>
          <Filters.Dropdown>
            <button onClick={handleClose}>Open Dropdown</button>
            <div>Dropdown Content</div>
          </Filters.Dropdown>
          <Filters.Popover>
            <div>Popover Content</div>
          </Filters.Popover>
        </MockFilterDropdownProvider>
      </Filters>
    );

    // Simulate clicking the dropdown button
    fireEvent.click(screen.getByText("Open Dropdown"));

    // Check if the popover content appears
    expect(screen.getByText("Popover Content")).toBeInTheDocument();
    expect(handleClose).toHaveBeenCalled(); // Check if the close handler was called
  });

  //check Yard Check Filter
  it("opens YARD CHECK filters panel when button is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Filters>
          <ButtonComponent />
          <Filters.Panel count={1} onResetFilters={vi.fn()} showFilterBar={true} onToggleFilterBar={vi.fn()}>
            <YardCheckFiltersPanel view="yard-check" />
          </Filters.Panel>
        </Filters>
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("Show Filter"));

    //filter common buttons
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Filter Bar")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();

    //main filters
    expect(screen.getByText("Landmark Filters")).toBeInTheDocument();
    expect(screen.getByText("Asset Filters")).toBeInTheDocument();
    expect(screen.getByText("Location Filters")).toBeInTheDocument();
    expect(screen.getByText("Sensor Filters")).toBeInTheDocument();
    expect(screen.getByText("Operational Filters")).toBeInTheDocument();

    //close the filters
    fireEvent.click(screen.getByText("Close"));
  });

  //check Accrued Distance Filter
  it("opens ACCRUED DISTANCE filters panel when button is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Filters>
          <ButtonComponent />
          <Filters.Panel count={1} onResetFilters={vi.fn()} showFilterBar={true} onToggleFilterBar={vi.fn()}>
            <AccruedDistanceFiltersPanel view="accrued-distance" />
          </Filters.Panel>
        </Filters>
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("Show Filter"));

    //filter common buttons
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Filter Bar")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();

    //main filters
    expect(screen.getByText("Asset Filters")).toBeInTheDocument();
    expect(screen.getByText("Operational Filters")).toBeInTheDocument();

    //close the filters
    fireEvent.click(screen.getByText("Close"));
  });

  it("close filters panel when close button is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Filters>
          <ButtonComponent />
          <Filters.Panel count={1} onResetFilters={vi.fn()} showFilterBar={true} onToggleFilterBar={vi.fn()}>
            <YardCheckFiltersPanel view="yard-check" />
          </Filters.Panel>
        </Filters>
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByText("Show Filter"));

    //on click close button side panel should be closed
    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.queryByText("Filter Bar")).not.toBeInTheDocument();
    });
  });
});
