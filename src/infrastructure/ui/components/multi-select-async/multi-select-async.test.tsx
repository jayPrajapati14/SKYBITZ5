import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MultiSelectAsync } from "./multi-select-async";

describe("MultiSelectAsync", () => {
  const mockOptions = [
    { id: "1", name: "One" },
    { id: "2", name: "Two" },
    { id: "3", name: "Three" },
  ];

  const mockGetOptions = vi.fn().mockResolvedValue(mockOptions);

  const defaultProps = {
    getOptions: mockGetOptions,
    getOptionId: (option: { id: string; name: string }) => option.id,
    getOptionLabel: (option: { id: string; name: string }) => option.name,
    noOptionsText: "No options",
    placeholder: "Select options",
  };

  test("renders correctly", () => {
    render(<MultiSelectAsync {...defaultProps} />);
    expect(screen.getByPlaceholderText("Select options")).toBeDefined();
  });

  test("displays options when focused and typed", async () => {
    render(<MultiSelectAsync {...defaultProps} getOptions={mockGetOptions} />);
    const input = screen.getByPlaceholderText("Select options");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "One" } });

    await waitFor(() => {
      expect(mockGetOptions).toHaveBeenCalledWith("One", { signal: new AbortController().signal });
    });

    expect(await screen.findAllByText("One")).toBeDefined();
  });

  test.only("calls getOptions when typing in the input", async () => {
    render(<MultiSelectAsync {...defaultProps} />);
    const input = screen.getByPlaceholderText("Select options");

    fireEvent.change(input, { target: { value: "One" } });

    await waitFor(() => {
      expect(mockGetOptions).toHaveBeenCalledWith("One", { signal: new AbortController().signal });
    });

    await waitFor(() => {
      expect(screen.getByText("One")).toBeDefined();
      fireEvent.click(screen.getByText("One"));
    });
  });

  test("render static options and clear on blur", async () => {
    render(<MultiSelectAsync {...defaultProps} getOptions={mockOptions} />);
    const input = screen.getByPlaceholderText("Select options");

    fireEvent.change(input, { target: { value: "One" } });

    await waitFor(() => {
      expect(mockGetOptions).toHaveBeenCalledWith("One");
    });

    fireEvent.blur(input);
    expect(input.getAttribute("value")).toBe("");
  });
});
