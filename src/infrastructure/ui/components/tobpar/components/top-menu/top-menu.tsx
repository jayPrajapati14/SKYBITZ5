import React from "react";
import { Drawer, IconButton, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { TopMenuLogo } from "../top-menu-logo";

type TopMenuProps = {
  menuItems: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    path?: string;
    subItems?: Array<{
      value: string;
      label: string;
      icon?: React.ReactNode;
      path?: string;
    }>;
  }>;
  open: boolean;
  onOpenChange: (opened: boolean) => void;
};

/** Conditional link component for top menu items
 * If the item has a path, it will be a link.
 * If the item does not have a path, it will be a button.
 */
function MenuItemLink({
  children,
  to,
  menuType,
  onClick,
}: {
  children: React.ReactNode;
  menuType?: string;
  to?: string;
  onClick?: () => void;
}) {
  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`tw-flex tw-w-full ${menuType === "mainMenu" ? "tw-p-1" : "tw-p-2 hover:tw-bg-black/5"}`}
      >
        {children}
      </Link>
    );
  }
  return <span className="tw-flex tw-p-1">{children}</span>;
}

export function TopMenu({ menuItems, open, onOpenChange }: TopMenuProps) {
  const handleDrawerToggle = (open: boolean) => () => {
    onOpenChange(open);
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={handleDrawerToggle(false)}
      transitionDuration={0}
      ModalProps={{
        BackdropProps: {
          style: { backgroundColor: "transparent" },
        },
      }}
    >
      <div className="tw-flex tw-h-screen tw-w-96 tw-flex-col tw-justify-between tw-bg-white">
        <div>
          <div className="tw-mx-10 tw-flex tw-pb-4 tw-pt-6">
            <IconButton onClick={handleDrawerToggle(!open)} edge="start" color="inherit" aria-label="menu" className="">
              <CloseIcon className="tw-size-6 tw-text-blue-500 hover:tw-text-blue-700" />
            </IconButton>
            <div className="tw-ml-4 tw-flex tw-w-1/2 tw-items-center md:tw-w-1/5">
              <Link to="/ng/dashboards">
                <TopMenuLogo />
              </Link>
            </div>
          </div>
          {menuItems.map((menuItem) => (
            <Accordion
              key={menuItem.value}
              defaultExpanded
              TransitionProps={{ unmountOnExit: true }}
              className={`!tw-border-y-0 tw-p-2 ${
                menuItems[menuItems.length - 1].value !== menuItem.value ? "!tw-border-b" : ""
              }`}
            >
              <AccordionSummary
                expandIcon={menuItem.subItems && menuItem.subItems.length > 0 ? <ExpandMoreIcon /> : null}
                aria-controls={`panel-${menuItem.value}-content`}
                id={`panel-${menuItem.value}-header`}
                className={`!tw-my-0 !tw-bg-white hover:!tw-bg-black/5`}
              >
                <div key={menuItem.value} className="tw-w-full tw-text-left tw-text-base">
                  <MenuItemLink to={menuItem.path} menuType="mainMenu" onClick={() => onOpenChange(false)}>
                    {menuItem.icon && <span className="tw-mr-6">{menuItem.icon}</span>}
                    {menuItem.label}
                  </MenuItemLink>
                </div>
              </AccordionSummary>
              {menuItem.subItems && menuItem.subItems.length > 0 && (
                <AccordionDetails className="tw-flex tw-h-auto tw-flex-col tw-items-start tw-justify-start tw-gap-2 !tw-p-2">
                  {menuItem.subItems.map((subItem) => (
                    <div key={subItem.value} className="tw-w-full tw-text-left tw-leading-[90%]">
                      <MenuItemLink to={subItem.path} onClick={() => onOpenChange(false)}>
                        <span className="tw-pl-14">{subItem.label}</span>
                      </MenuItemLink>
                    </div>
                  ))}
                </AccordionDetails>
              )}
            </Accordion>
          ))}
        </div>
        <div className="tw-py-4">
          <div className="tw-flex tw-items-center tw-justify-center tw-gap-4 tw-text-xs">
            <Link
              to="https://insight.skybitz.com/SBTermsAndConditions.html"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-text-text-secondary"
            >
              Terms & Conditions
            </Link>
            <Link
              to="https://www.skybitz.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="tw-text-text-secondary"
            >
              Privacy Statement
            </Link>
          </div>
          <div className="tw-pt-2 tw-text-center tw-text-xs tw-text-text-disabled">© 2025 SkyBitz v0.2</div>
        </div>
      </div>
    </Drawer>
  );
}
