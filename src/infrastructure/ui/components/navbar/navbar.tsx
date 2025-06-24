import { Button, Divider } from "@mui/material";
import { Link } from "react-router-dom";
import { Count } from "../count/count";
import { ExpandMore } from "@mui/icons-material";
import { ReactNode } from "react";
import { useUser } from "@/hooks/use-user";
import { isUserSpecific } from "@/infrastructure/feature-flag/utils";

type NavBarLink = {
  label: string;
  path: string;
  toUser?: number | number[];
};

type NavBarProps = {
  leftLinks: Array<NavBarLink>;
  rightLinks?: Array<NavBarLink>;
  filtersCount?: number;
  toggleDrawer?: () => void;
  rightSection?: ReactNode;
  showFilters?: boolean;
};

export const NavBar = ({
  leftLinks,
  rightLinks,
  filtersCount = 0,
  toggleDrawer,
  rightSection,
  showFilters = true,
}: NavBarProps) => {
  const user = useUser();
  return (
    <div className="tw-flex tw-flex-1 tw-items-center tw-justify-end tw-gap-0">
      <div className="tw-flex tw-flex-1 tw-rounded-md tw-bg-blue-50 tw-p-1">
        <div className="tw-flex tw-flex-1 tw-flex-wrap tw-items-center tw-gap-2">
          {leftLinks
            .filter((link) => user && isUserSpecific(link.toUser, user.id))
            .map((link, index) => (
              <Link key={index} to={link.path}>
                <Button
                  variant={link.path === location.pathname ? "contained" : "text"}
                  sx={{ textTransform: "capitalize" }}
                  className="!tw-font-normal"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
        </div>

        {rightLinks && rightLinks.length > 0 ? (
          <>
            <Divider orientation="vertical" flexItem />
            <div className="tw-ml-1 tw-flex tw-gap-2">
              {rightLinks.map((link, index) => (
                <Link key={index} to={link.path}>
                  <Button
                    variant={link.path === location.pathname ? "contained" : "text"}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div id="navbar-right-section" className="tw-ml-1 tw-flex tw-gap-2">
        {showFilters && (
          <Button
            onClick={() => toggleDrawer?.()}
            color="inherit"
            startIcon={<Count count={filtersCount} forceShow color={filtersCount > 0 ? "secondary.main" : "gray"} />}
            endIcon={<ExpandMore />}
            sx={{ textTransform: "none" }}
          >
            Filters
          </Button>
        )}
        {rightSection}
      </div>
    </div>
  );
};
