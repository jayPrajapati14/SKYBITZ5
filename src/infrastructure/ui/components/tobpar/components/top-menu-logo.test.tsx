import { render, screen } from "@testing-library/react";
import { TopMenuLogo } from "./top-menu-logo";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("Logo Component", () => {
  it("renders the logo SVG correctly", () => {
    render(<TopMenuLogo />);
    const logoElement = screen.getByTestId("top-Menu-logo-svg");
    expect(logoElement).toBeInTheDocument();
  });
});
