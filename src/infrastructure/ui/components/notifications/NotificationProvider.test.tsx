import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { NotificationProvider } from "./NotificationProvider";
import { useShowNotification } from "./useShowNotification";
import { describe, expect, beforeEach, it } from "vitest";
import "@testing-library/jest-dom";

const TestComponent: React.FC = () => {
  const showNotification = useShowNotification();

  const handleClick = () => {
    showNotification({
      type: "success",
      message: "Test notification",
      duration: 100,
    });
  };

  return <button onClick={handleClick}>Show Notification</button>;
};

describe("NotificationContext", () => {
  beforeEach(() => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );
  });

  it("should show notification when button is clicked", async () => {
    fireEvent.click(screen.getByText(/Show Notification/i));
    expect(await screen.findByText(/Test notification/i)).toBeInTheDocument();
  });

  it("should remove notification after duration", async () => {
    fireEvent.click(screen.getByText(/Show Notification/i));
    await waitFor(
      () => {
        expect(screen.queryByText(/Test notification/i)).not.toBeInTheDocument();
      },
      { timeout: 900 }
    );
  });
});
