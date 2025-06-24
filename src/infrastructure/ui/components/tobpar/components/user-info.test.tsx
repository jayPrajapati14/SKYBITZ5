import { render, screen, fireEvent } from "@testing-library/react";
import { UserInfo } from "./user-info";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

describe("UserInfo Component", () => {
  const user: User = {
    id: 1,
    username: "testuser",
    email: "testuser@example.com",
    type: "admin",
    customerId: 123,
    firstName: "Test",
    lastName: "User",
    timezone: "GMT",
  };

  it("renders the user info correctly", () => {
    render(<UserInfo user={user} />);
    const usernameElement = screen.getByText(user.username);
    expect(usernameElement).toBeInTheDocument();
  });

  it("opens the menu when the avatar is clicked", () => {
    render(<UserInfo user={user} />);
    const avatarElement = screen.getByRole("button");
    fireEvent.click(avatarElement);
    const menuElement = screen.getByRole("menu");
    expect(menuElement).toBeInTheDocument();
  });
});
