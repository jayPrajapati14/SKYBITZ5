import { ReactNode } from "react";

type SidebarLayoutProps = {
  children: ReactNode;
};

export function SidebarLayout({ children }: SidebarLayoutProps) {
  return <div className="tw-flex tw-flex-col tw-gap-3 md:tw-h-full lg:tw-flex-row">{children}</div>;
}

SidebarLayout.Sidebar = ({ children }: { children: ReactNode }) => (
  <div className="tw-w-full lg:tw-w-[444px]">{children}</div>
);

SidebarLayout.Content = ({ children }: { children: ReactNode }) => (
  <div className="tw-flex-1 tw-overflow-auto">{children}</div>
);

SidebarLayout.Widget = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="tw-mb-5 tw-rounded-md tw-border tw-p-2 tw-pt-0">
    <h1 className="tw-p-2.5 tw-text-base tw-font-medium tw-text-text-secondary">{title}</h1>
    {children}
  </div>
);
