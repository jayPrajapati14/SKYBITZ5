import { render, screen, fireEvent } from "@testing-library/react";
import { SingleSelect } from "./single-select";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

type SingleSelectProps = {
  value: number | string | undefined;
  options: Array<{
    value: number;
    label: string;
  }>;
  emptyLabel?: string;
  onChange: () => void;
  onClear?: () => void;
  disabled?: boolean;
  defaultOpen?: boolean;
};

const renderSingleSelect = (props: SingleSelectProps) => {
  return render(<SingleSelect {...props} />);
};

describe("SingleSelect Component", () => {
  const options = [
    { value: 1, label: "Option 1" },
    { value: 2, label: "Option 2" },
    { value: 3, label: "Option 3" },
  ];

  it("should render the component with options", () => {
    renderSingleSelect({ value: undefined, options, onChange: vi.fn(), defaultOpen: true });

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it("should call onChange when an option is selected", () => {
    const onChangeMock = vi.fn();
    renderSingleSelect({ value: undefined, options, defaultOpen: true, onChange: onChangeMock });

    fireEvent.click(screen.getByText(options[1].label));
    expect(onChangeMock).toHaveBeenCalledWith(options[1].value);
  });

  it("should display empty label if no value is selected", () => {
    const emptyLabel = "Select an option";
    renderSingleSelect({ value: undefined, options, onChange: vi.fn(), emptyLabel, defaultOpen: true });

    expect(screen.getByText(emptyLabel)).toBeInTheDocument();
  });

  it("should call onClear when the clear button is clicked", () => {
    const onClearMock = vi.fn();
    renderSingleSelect({ value: 1, options, onChange: vi.fn(), onClear: onClearMock, defaultOpen: true });

    const clearButton = screen.getByTestId("ClearIcon");
    fireEvent.click(clearButton);

    expect(onClearMock).toHaveBeenCalled();
  });
});
