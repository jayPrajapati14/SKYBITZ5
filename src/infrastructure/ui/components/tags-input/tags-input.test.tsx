import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TagsInput from "./tags-input";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";

const renderTagsInput = (props = {}) => {
  return render(<TagsInput label="Tags" placeholder="Enter tags" onChange={vi.fn()} tags={[]} {...props} />);
};

describe("TagsInput Component", () => {
  it("should render the component with the correct label", () => {
    renderTagsInput();
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
  });

  it("should allow adding a tag when pressing 'Enter'", () => {
    const onChange = vi.fn();
    renderTagsInput({ onChange, tags: [] });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "tag1" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(onChange).toHaveBeenCalledWith(["tag1"]);
    expect(input).toHaveValue("");
  });

  it("should allow adding a tag when pressing 'Space'", () => {
    const onChange = vi.fn();
    renderTagsInput({ onChange, tags: [] });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "tag2" } });
    fireEvent.keyDown(input, { key: " ", code: "Space" });

    expect(onChange).toHaveBeenCalledWith(["tag2"]);
    expect(input).toHaveValue("");
  });

  it("should allow adding a tag when pressing ','", () => {
    const onChange = vi.fn();
    renderTagsInput({ onChange, tags: [] });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "tag3" } });
    fireEvent.keyDown(input, { key: ",", code: "Comma" });

    expect(onChange).toHaveBeenCalledWith(["tag3"]);
    expect(input).toHaveValue("");
  });

  it("should not add a tag if it fails the validation", () => {
    const validator = vi.fn((tag) => tag !== "invalid");
    const onChange = vi.fn();
    renderTagsInput({ onChange, tags: [], validator });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "invalid" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(validator).toHaveBeenCalledWith("invalid");
    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("invalid");
  });

  it("should handle input change correctly", () => {
    renderTagsInput({ tags: [] });

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "tag4" } });
    expect(input).toHaveValue("tag4");
  });

  it("should render tags and allow removal", async () => {
    const onChange = vi.fn();
    const tags = ["tag1", "tag2"];
    renderTagsInput({ onChange, tags });

    const chips = screen.getAllByRole("button", { name: /tag/i });
    expect(chips.length).toBe(2);
    expect(chips[0]).toHaveTextContent("tag1");
    expect(chips[1]).toHaveTextContent("tag2");

    const removeButton = chips[0].querySelector("svg");
    if (removeButton) {
      fireEvent.click(removeButton);
    } else {
      throw new Error("Remove button not found");
    }

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(["tag2"]);
    });
  });
});
