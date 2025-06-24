import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PaginationModel, SortModel } from "./store.types";
import { initialPaginationModel } from "./store.constants";
import { getCurrentUserId } from "@/domain/services/user/user.service";

export type ReportsState = {
  paginationModel: PaginationModel;
  sortModel: SortModel;
  actions: {
    setPaginationModel: (model: PaginationModel) => void;
    setSortModel: (model: SortModel) => void;
  };
};

const userId = getCurrentUserId();

const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      paginationModel: { ...initialPaginationModel },
      sortModel: [],
      actions: {
        setPaginationModel(model) {
          set((state) => ({
            ...state,
            paginationModel: model,
          }));
        },
        setSortModel(model) {
          set((state) => ({
            ...state,
            sortModel: model,
          }));
        },
      },
    }),
    {
      partialize: (state) => ({
        sortModel: state.sortModel,
        paginationModel: state.paginationModel,
      }),
      name: `${userId}:reports-view`,
    }
  )
);
export const useReportsActions = () => useReportsStore((state) => state.actions);
export const useReportsPaginationModel = () => useReportsStore((state) => state.paginationModel);
export const useReportsSortModel = () => useReportsStore((state) => state.sortModel);
