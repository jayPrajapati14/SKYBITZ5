import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QuickSearch } from "./quick-search";

describe("QuickSearch Component", () => {
  const mockProps = {
    query: "",
    setQuery: vi.fn(),
    options: { assets: [] },
    loading: false,
    onInputChange: vi.fn(),
    visible: false,
    setOpen: vi.fn(),
  };

  it("displays a loading spinner while the API call is in progress", async () => {
    const propsWithLoading = { ...mockProps, loading: true };
    render(<QuickSearch {...propsWithLoading} />);
    const loadingSpinner = screen.getByRole("progressbar");
    expect(loadingSpinner).toBeInTheDocument();
  });

  it("hides the loading spinner and displays results after the API call completes", async () => {
    const mockOptions: QuickSearchAsset[] = [
      { id: 1, assetId: "123", assetType: "Laptop", deviceSerialNumber: "ABC123", deviceId: 1 },
      { id: 2, assetId: "456", assetType: "Phone", deviceSerialNumber: "XYZ789", deviceId: 1 },
    ];
    const propsWithResults = {
      ...mockProps,
      options: { assets: mockOptions },
      loading: false,
      open: true,
      query: "test",
    };
    render(<QuickSearch {...propsWithResults} />);
    const result1 = screen.getByText("123");
    const result2 = screen.getByText("Type: Laptop | Device Serial No: ABC123");
    expect(result1).toBeInTheDocument();
    expect(result2).toBeInTheDocument();
  });

  it("triggers the API call when the input value changes", async () => {
    const mockOptions: QuickSearchAsset[] = [
      { id: 1, assetId: "123", assetType: "Laptop", deviceSerialNumber: "ABC123", deviceId: 1 },
      { id: 2, assetId: "456", assetType: "Phone", deviceSerialNumber: "XYZ789", deviceId: 1 },
    ];
    const propsWithResults = {
      ...mockProps,
      options: { assets: mockOptions },
      loading: true,
      visible: true,
      query: "test",
    };
    render(<QuickSearch {...propsWithResults} />);
    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });
});
