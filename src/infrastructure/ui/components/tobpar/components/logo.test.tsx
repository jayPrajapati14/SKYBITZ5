import { render, screen } from "@testing-library/react";
import { Logo } from "./logo";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("Logo Component", () => {
  it("renders the logo SVG correctly", () => {
    render(<Logo />);
    const logoElement = screen.getByTestId("logo-svg");
    expect(logoElement).toBeInTheDocument();
  });
});
