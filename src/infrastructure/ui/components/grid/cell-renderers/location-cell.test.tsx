import { render, screen } from "@testing-library/react";
import { LocationCell } from "./location-cell";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@mui/material/Tooltip", () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="tooltip" data-tooltip-title={title}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/location-icons/AtLandmark", () => ({
  AtLandmarkIcon: () => <span data-testid="landmark-icon">Landmark</span>,
}));

vi.mock("@/components/location-icons/AtPointOfInterest", () => ({
  AtPointOfInterestIcon: () => <span data-testid="poi-icon">POI</span>,
}));

vi.mock("@/components/location-icons/AtLocation", () => ({
  AtLocationIcon: () => <span data-testid="location-icon">Location</span>,
}));

describe("LocationCell", () => {
  describe("when type is 1 (Landmark)", () => {
    it("renders landmark icon and name when landmarkName is provided", () => {
      render(<LocationCell type="CUSTOM" landmarkName="Eiffel Tower" />);
      expect(screen.getByTestId("landmark-icon")).toBeInTheDocument();
      expect(screen.getByText("Eiffel Tower")).toBeInTheDocument();
    });

    it("returns empty string when landmarkName is undefined", () => {
      const { container } = render(<LocationCell type="CUSTOM" />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("when type is 2 (Point of Interest)", () => {
    it("renders POI icon and name when landmarkName is provided", () => {
      render(<LocationCell type="POI" landmarkName="Central Park" />);
      expect(screen.getByTestId("poi-icon")).toBeInTheDocument();
      expect(screen.getByText("Central Park")).toBeInTheDocument();
    });

    it("returns empty string when landmarkName is undefined", () => {
      const { container } = render(<LocationCell type="CUSTOM" />);
      expect(container).toBeEmptyDOMElement();
    });
  });

  describe("when type is 3 (Location with distance)", () => {
    it("renders full location without landmarkName", () => {
      render(<LocationCell type="GENERIC" miles={5} direction="NE" city="New York" state="NY" zip={"10001"} />);

      expect(screen.getByTestId("location-icon")).toBeInTheDocument();
      expect(screen.getByText("5.00")).toBeInTheDocument();
      expect(screen.getByText("mi")).toBeInTheDocument();
      expect(screen.getByText("NE")).toBeInTheDocument();
      expect(screen.getByText("from")).toBeInTheDocument();
      expect(screen.getByText("New York, NY, 10001")).toBeInTheDocument();
    });

    it("renders partial location with minimal props", () => {
      render(<LocationCell type="GENERIC" city="New York" />);
      expect(screen.getByTestId("location-icon")).toBeInTheDocument();
      expect(screen.getByText("New York")).toBeInTheDocument();
    });

    it("handles empty location string", () => {
      render(<LocationCell type="GENERIC" />);
      expect(screen.getByTestId("location-icon")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles all optional props as undefined for type 3", () => {
      render(<LocationCell type="GENERIC" />);
      expect(screen.getByTestId("location-icon")).toBeInTheDocument();
    });
  });
});
