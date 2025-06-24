import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmationDialog } from "./confirmation-dialog";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

describe("ConfirmationDialog", () => {
  const setup = (propsOverrides = {}) => {
    const props = {
      title: "Test Title",
      isOpen: true,
      setIsOpen: vi.fn(),
      loading: false,
      onConfirm: vi.fn(),
      children: <div>Test Content</div>,
      okButtonText: "Confirm",
      cancelButtonText: "Cancel",
      ...propsOverrides,
    };
    render(<ConfirmationDialog {...props} />);
    return props;
  };

  it("renders the dialog with title and content", () => {
    setup();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", () => {
    const props = setup();
    const confirmButton = screen.getByText("Confirm");

    fireEvent.click(confirmButton);
    expect(props.onConfirm).toHaveBeenCalled();
  });

  it("disables the confirm button while loading", () => {
    setup({ loading: true });
    const confirmButton = screen.getByText("Confirm").closest("button");
    expect(confirmButton).toBeDisabled();
  });

  it("calls setIsOpen with false when cancel button is clicked", () => {
    const props = setup();
    const cancelButton = screen.getByText("Cancel");

    fireEvent.click(cancelButton);
    expect(props.setIsOpen).toHaveBeenCalledWith(false);
  });

  it("does not render the dialog when isOpen is false", () => {
    setup({ isOpen: false });
    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
  });
});
