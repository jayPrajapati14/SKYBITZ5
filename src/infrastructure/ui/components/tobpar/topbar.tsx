import { AppBar, IconButton, Toolbar, debounce } from "@mui/material";
import { Logo } from "@/components/tobpar/components/logo";
import { Link } from "react-router-dom";
import { UserInfo } from "./components/user-info";
import { QuickSearch } from "./components/quick-search/quick-search";
import { routeConfigs } from "@/infrastructure/ui/routes";
import { useUser } from "@/hooks/use-user";
import { useState, useEffect, useRef, useMemo } from "react";
import { quickSearch } from "@/domain/services/quick-search/quick-search.service";
import { Feature } from "@/components/feature-flag";
import { useGenericAssetActions } from "@/store/generic-asset.store";
import { useNavigate } from "react-router-dom";
import { TopMenu } from "@/components/tobpar/components/top-menu/top-menu";
import MenuIcon from "@mui/icons-material/Menu";
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useGenericAssetFilters } from "@/store/generic-asset.store";
import { useQueryClient } from "@tanstack/react-query";

export function Topbar() {
  const user = useUser();
  const defaultSearchOptions = { assets: [] };
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<QuickSearchResult>(defaultSearchOptions);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { setFilter } = useGenericAssetActions(true);
  const navigate = useNavigate();
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const { operational } = useGenericAssetFilters(true);
  const queryClient = useQueryClient();

  const TOPMENU_ITEMS = [
    {
      value: "Operations",
      label: "Operations",
      icon: <SpaceDashboardOutlinedIcon className="tw-text-gray-500" />,
      subItems: [
        {
          value: "dashboards",
          label: "Dashboard",
          path: routeConfigs?.dashboards?.path,
        },
        {
          value: "yardCheck",
          label: "Yard Check",
          path: routeConfigs?.yardCheck?.path,
        },
        {
          value: "YardCheck(0.2)",
          label: "Yard Check(0.2)",
          path: routeConfigs?.yardCheck2?.path,
        },
        {
          value: "idleAssets",
          label: "Idle Assets",
          path: routeConfigs?.idleAssets?.path,
        },
        {
          value: "MovingAssets",
          label: "Moving Assets",
          path: routeConfigs?.movingAssets?.path,
        },
        {
          value: "assets",
          label: "Assets",
          path: routeConfigs?.assets?.path,
        },
        {
          value: "accruedDistance",
          label: "Accrued Distance",
          path: routeConfigs?.accruedDistance?.path,
        },
        {
          value: "accruedDistance",
          label: "Accrued Distance (Mileage)",
          path: routeConfigs?.accruedDistance2?.path,
        },
      ],
    },
    {
      value: "reports",
      label: "Reporting",
      icon: <AssignmentIcon className="tw-text-gray-500" />,
      path: routeConfigs?.reports2?.path,
    },
  ];

  const debouncedSearch = useMemo(
    () =>
      debounce(async (inputText: string) => {
        try {
          if (abortControllerRef.current) abortControllerRef.current.abort();
          abortControllerRef.current = new AbortController();

          const result = await quickSearch(
            { byTextSearch: inputText, lastReported: operational.lastReported },
            {
              signal: abortControllerRef.current.signal,
            }
          );
          setOptions(result);
          setOpen(true);
          setLoading(false);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
          throw error;
        }
      }, 400),
    []
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const onInputChange = (inputText: string) => {
    setQuery(inputText);
    setOptions(defaultSearchOptions);
    setLoading(true);
    if (inputText) {
      debouncedSearch(inputText);
    }

    if (!inputText) {
      setOptions(defaultSearchOptions);
      setLoading(false);
    }
  };

  const openListView = (inputText: string) => {
    queryClient.invalidateQueries({ queryKey: ["generic-assets"] });
    setFilter("asset", "byTextSearch", inputText);
    navigate(routeConfigs.assets.path);
  };

  return (
    <AppBar color="transparent" elevation={0} position="static">
      <Toolbar className="tw-flex tw-w-full tw-flex-wrap tw-py-4 tw-pb-0 tw-pt-2 md:tw-flex-nowrap">
        <div className="tw-flex tw-w-1/2 tw-items-center sm:tw-m-4 md:tw-w-1/5">
          <Feature flag="top-menu">
            <IconButton onClick={() => setTopMenuOpen(true)} edge="start" color="inherit" aria-label="menu">
              <MenuIcon className="tw-size-6 tw-text-blue-500 hover:tw-text-blue-700" />
            </IconButton>
            <TopMenu menuItems={TOPMENU_ITEMS} onOpenChange={(open) => setTopMenuOpen(open)} open={topMenuOpen} />
          </Feature>
          <Link to="/ng/dashboards" className="tw-ml-4">
            <Logo />
          </Link>
        </div>
        <div className="tw-order-last tw-my-3 tw-flex tw-w-full tw-justify-center sm:tw-my-0 md:tw-order-none md:tw-w-3/5 md:tw-justify-center">
          <Feature flag="quick-search">
            <div className="tw-w-full sm:tw-min-w-[396px] sm:tw-max-w-[396px]">
              <QuickSearch
                open={open}
                setOpen={setOpen}
                query={query}
                setQuery={setQuery}
                options={options}
                loading={loading}
                onInputChange={onInputChange}
                openListView={openListView}
              />
            </div>
          </Feature>
        </div>
        <div className="tw-flex tw-w-1/2 tw-justify-end md:tw-w-1/5">
          <UserInfo user={user} />
        </div>
      </Toolbar>
    </AppBar>
  );
}
