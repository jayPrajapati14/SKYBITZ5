import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { TopMenu } from "./top-menu";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

// Mock for React Router's Link component
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
      <a href={to} onClick={onClick} data-testid={`link-${to}`}>
        {children}
      </a>
    ),
  };
});

describe("TopMenu Component", () => {
  const mockMenuOpened = vi.fn();
  const menuItems = [
    {
      value: "item1",
      label: "Item 1",
      icon: <span>Icon1</span>,
      path: "/item1",
    },
    {
      value: "item2",
      label: "Item 2",
      subItems: [
        {
          value: "subitem1",
          label: "Sub Item 1",
          path: "/subitem1",
        },
        {
          value: "subitem2",
          label: "Sub Item 2",
          path: "/subitem2",
        },
      ],
    },
  ];

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <TopMenu menuItems={menuItems} open={true} onOpenChange={mockMenuOpened} />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders menu items correctly", () => {
    renderComponent();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("calls onOpenChange when the close button is clicked", () => {
    renderComponent();
    const closeButton = screen.getByLabelText("menu");
    fireEvent.click(closeButton);
    expect(mockMenuOpened).toHaveBeenCalledWith(false);
  });

  it("navigates when a menu item with path is clicked", () => {
    renderComponent();
    const item1 = screen.getByText("Item 1");
    fireEvent.click(item1);
    expect(mockMenuOpened).toHaveBeenCalledWith(false);
  });

  it("expands accordion and shows sub-items when clicking on parent item", () => {
    renderComponent();
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);
    expect(screen.getByText("Sub Item 1")).toBeVisible();
    expect(screen.getByText("Sub Item 2")).toBeVisible();
  });

  it("renders sub-items correctly when they exist", () => {
    renderComponent();
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);
    expect(screen.getByText("Sub Item 1")).toBeInTheDocument();
    expect(screen.getByText("Sub Item 2")).toBeInTheDocument();
  });

  it("calls onOpenChange when clicking a sub-menu item with path", () => {
    renderComponent();
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);
    const subItem1 = screen.getByText("Sub Item 1");
    fireEvent.click(subItem1);
    expect(mockMenuOpened).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange when clicking the MenuItemLink inside a button", () => {
    renderComponent();

    // Open the accordion first
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);

    // Find and click on the link inside the button
    const subItemLink = screen.getByTestId("link-/subitem1");
    fireEvent.click(subItemLink);

    expect(mockMenuOpened).toHaveBeenCalledWith(false);
  });

  it("renders the close button with the correct icon", () => {
    renderComponent();
    const closeButton = screen.getByLabelText("menu");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.querySelector("svg")).toHaveClass("tw-size-6 tw-text-blue-500");
  });

  it("renders the TopMenuLogo component", () => {
    renderComponent();
    const logoLink = screen.getByRole("link", { name: "" });
    expect(logoLink).toBeInTheDocument();
    expect(logoLink.querySelector("svg")).toBeInTheDocument(); // Assuming TopMenuLogo renders an SVG
  });

  it("renders Terms & Conditions and Privacy Statement links", () => {
    renderComponent();
    const termsLink = screen.getByText("Terms & Conditions");
    const privacyLink = screen.getByText("Privacy Statement");
    expect(termsLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute("href", "https://insight.skybitz.com/SBTermsAndConditions.html");
    expect(privacyLink).toHaveAttribute("href", "https://www.skybitz.com/privacy");
  });

  it("renders the footer with the correct text", () => {
    renderComponent();
    const footerText = screen.getByText("© 2025 SkyBitz v0.2");
    expect(footerText).toBeInTheDocument();
    expect(footerText).toHaveClass("tw-text-center tw-text-xs tw-text-text-disabled");
  });
});
