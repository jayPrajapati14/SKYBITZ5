import { YardCheck } from "@/views/yard-check/yard-check";
import { AccruedDistance } from "@/views/accrued-distance/accrued-distance";
import { Reports } from "@/views/reports/reports";
import { Reports2 } from "@/views/reports/reports2";
import { redirect } from "react-router-dom";
import { ErrorPage } from "@/views/errors/error-page";
import { Dashboards } from "@/views/dashboards/dashboards";
import { Layout } from "@/views/layout/layout";
import { GenericAssets } from "@/views/generic-assets/generic-assets";
import { IdleAssets } from "@/views/idle-assets/idle-assets";
import { YardCheck2 } from "@/views/yard-check/yard-check2";
import { AccruedDistance2 } from "@/views/accrued-distance/accrued-distance-2";
import { MovingAssets } from "@/views/moving-assets/moving-assets";
import { featureFlags } from "@/infrastructure/feature-flag/feature-flag";
import { FallbackPage } from "@/views/errors/fallback-page";
interface RouteConfig {
  label: string;
  path: string;
  Component: () => React.ReactNode;
  enabled: boolean;
  toUser?: number | number[];
  inLeft: boolean;
  inRight: boolean;
}

export const routeConfigs: Record<string, RouteConfig> = {
  yardCheck: {
    label: "Yard Check",
    path: "/ng/yard-check",
    Component: YardCheck,
    enabled: true,
    inLeft: true,
    inRight: false,
  },
  yardCheck2: {
    label: "Yard Check(0.2)",
    path: "/ng/yard-check-2",
    Component: YardCheck2,
    enabled: featureFlags["yard-check"].enabled,
    toUser: featureFlags["yard-check"].toUser,
    inLeft: true,
    inRight: false,
  },
  idleAssets: {
    label: "Idle Assets",
    path: "/ng/idle-assets",
    Component: IdleAssets,
    enabled: featureFlags["idle-assets"].enabled,
    toUser: featureFlags["idle-assets"].toUser,
    inLeft: true,
    inRight: false,
  },
  movingAssets: {
    label: "Moving Assets",
    path: "/ng/moving-assets",
    Component: MovingAssets,
    enabled: featureFlags["moving-assets"].enabled,
    toUser: featureFlags["moving-assets"].toUser,
    inLeft: true,
    inRight: false,
  },
  reports: {
    label: "Reports",
    path: "/ng/reports",
    Component: Reports,
    enabled: true,
    inLeft: false,
    inRight: true,
  },
  dashboards: {
    label: "Dashboards",
    path: "/ng/dashboards",
    Component: Dashboards,
    enabled: featureFlags["dashboards"].enabled,
    toUser: featureFlags["dashboards"].toUser,
    inLeft: false,
    inRight: false,
  },
  assets: {
    label: "Assets",
    path: "/ng/assets",
    Component: GenericAssets,
    enabled: featureFlags["generic-assets"].enabled,
    toUser: featureFlags["generic-assets"].toUser,
    inLeft: true,
    inRight: false,
  },
  accruedDistance: {
    label: "Accrued Distance",
    path: "/ng/accrued-distance",
    Component: AccruedDistance,
    enabled: true,
    inLeft: true,
    inRight: false,
  },
  accruedDistance2: {
    label: "Accrued Distance (Mileage)",
    path: "/ng/accrued-distance-2",
    Component: AccruedDistance2,
    enabled: featureFlags["accrued-distance"].enabled,
    toUser: featureFlags["accrued-distance"].toUser,
    inLeft: true,
    inRight: false,
  },
  reports2: {
    label: "Reports",
    path: "/ng/reports-2",
    Component: Reports2,
    enabled: true,
    inLeft: false,
    inRight: false,
  },
};

export const APP_LINKS = {
  left: Object.values(routeConfigs)
    .filter((route) => route.enabled && route.inLeft)
    .map((route) => ({
      label: route.label,
      path: route.path,
      toUser: route.toUser,
    })),
  right: Object.values(routeConfigs)
    .filter((route) => route.enabled && route.inRight)
    .map((route) => ({
      label: route.label,
      path: route.path,
    })),
};

export const routes = [
  {
    index: true,
    loader: () => redirect("/ng/yard-check"),
  },
  {
    id: "main",
    path: "/",
    Component: Layout,
    errorElement: <FallbackPage />,
    children: [
      ...Object.values(routeConfigs)
        .filter((route) => route.enabled)
        .map((route) => ({
          path: route.path.slice(1),
          Component: route.Component,
        })),
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: "/yard-check",
    loader: () => redirect("/ng/yard-check"),
  },
];
