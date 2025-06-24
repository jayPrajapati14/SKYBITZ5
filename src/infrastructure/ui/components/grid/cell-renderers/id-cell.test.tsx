import { render, screen } from "@testing-library/react";
import { IdCell } from "./id-cell";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

describe("IdCell Component", () => {
  it("renders a link with the correct path and id", () => {
    const id = "123";

    render(
      <MemoryRouter>
        <IdCell assetId={id} />
      </MemoryRouter>
    );

    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("123");
  });
});
