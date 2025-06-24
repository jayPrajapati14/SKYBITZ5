import { ReactNode } from "react";

type Children = { children: ReactNode };

export const TileWrapper = ({ children }: Children) => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-5">
      <div className="tw-grid tw-h-full tw-gap-2 sm:tw-grid-cols-2">{children}</div>
    </div>
  );
};

export const DonutChartContainer = ({ children }: Children) => {
  return <div className="tw-h-52 tw-w-60">{children}</div>;
};

export const KpiListContainer = ({ children }: Children) => {
  return <div className="tw-flex tw-w-full tw-flex-col tw-gap-3">{children}</div>;
};

export const KpiItem = ({ children }: Children) => {
  return <div className="tw-w-full tw-text-sm tw-font-normal tw-capitalize tw-text-text-primary">{children}</div>;
};
