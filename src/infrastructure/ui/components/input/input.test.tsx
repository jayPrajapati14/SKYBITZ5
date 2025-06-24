import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Input } from "./input";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

// Mock debounce function to avoid actual waiting time in tests
vi.mock("lodash/debounce", () => vi.fn((fn) => fn));

describe("Input Component", () => {
  it("renders with initial value", () => {
    render(<Input value="initial value" onChange={vi.fn()} clear={vi.fn()} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("initial value");
  });

  it("displays clear button when there is input", () => {
    render(<Input value="test" onChange={vi.fn()} clear={vi.fn()} />);
    const clearButton = screen.getByRole("button");
    expect(clearButton).toBeInTheDocument();
  });

  it("does not display clear button when input is empty", () => {
    render(<Input value="" onChange={vi.fn()} clear={vi.fn()} />);
    const clearButton = screen.queryByRole("button");
    expect(clearButton).not.toBeInTheDocument();
  });

  it("calls clear function and resets input when clear button is clicked", () => {
    const clear = vi.fn();
    render(<Input value="test" onChange={vi.fn()} clear={clear} />);

    const clearButton = screen.getByRole("button");
    fireEvent.click(clearButton);

    expect(clear).toHaveBeenCalledTimes(1); // check if clear function was called
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue(""); // input value should be cleared
  });

  it("displays placeholder when provided", () => {
    render(<Input value="" onChange={vi.fn()} clear={vi.fn()} placeholder="Enter text here" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Enter text here");
  });

  it("does not call onChange immediately due to debounce", async () => {
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} clear={vi.fn()} debounceMs={500} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hello" } });
    fireEvent.change(input, { target: { value: "hello world" } });

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1)); // only one call after debouncing
    expect(onChange).toHaveBeenCalledWith("hello world");
  });
});
