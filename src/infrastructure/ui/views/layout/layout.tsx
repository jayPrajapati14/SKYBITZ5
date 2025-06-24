import { Topbar } from "@/components/tobpar/topbar";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

type Children = { children: ReactNode };

export function Layout() {
  return (
    <div className="tw-flex tw-size-full tw-flex-1 tw-flex-col">
      <Topbar />
      <main className="tw-flex tw-flex-1 tw-flex-col tw-overflow-auto tw-p-6 tw-pt-0">
        <Outlet />
      </main>
    </div>
  );
}

Layout.Title = ({ children }: Children) => {
  return <h1 className="tw-mb-2">{children}</h1>;
};

Layout.Navigation = ({ children }: Children) => {
  return <div className="tw-mb-2 tw-text-gray-600">{children}</div>;
};

Layout.Controls = ({ children }: Children) => (
  <div className="tw-mb-4 tw-flex tw-flex-col tw-gap-1 tw-rounded-md tw-border tw-bg-white lg:tw-p-2">{children}</div>
);

Layout.Content = ({ children }: Children) => <div className="tw-h-full tw-overflow-auto">{children}</div>;
