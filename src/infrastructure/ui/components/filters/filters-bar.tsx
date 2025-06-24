import { ReactNode } from "react";

type FiltersBarProps = {
  children: ReactNode;
};

export function FiltersBar({ children }: FiltersBarProps) {
  return (
    <div className="tw-flex tw-min-h-fit tw-flex-wrap tw-items-center tw-gap-2 tw-rounded-md tw-border tw-p-1">
      {children}
    </div>
  );
}
