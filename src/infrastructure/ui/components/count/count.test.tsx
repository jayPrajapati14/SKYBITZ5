import { render, screen } from "@testing-library/react";
import { Count } from "./count";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("Count", () => {
  it("renders the count when count is greater than 0", () => {
    render(<Count count={5} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders the count when count is a string", () => {
    render(<Count count="5" />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders nothing when count is 0 and forceShow is false", () => {
    const { container } = render(<Count count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the count when count is 0 and forceShow is true", () => {
    render(<Count count={0} forceShow={true} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
