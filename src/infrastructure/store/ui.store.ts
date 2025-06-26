import { create } from "zustand";
import { persist } from "zustand/middleware";

type TableColumnWidthParameters = {
  minWidth: number;
  width: number | undefined;
  flex: 0 | 1;
};

type ColumnParametersInput = {
  tableId: string;
  columnId: string;
  minWidth: number;
};

type UIStore = {
  // Drawer
  openDrawer: boolean;
  toggleDrawer: () => void;

  // Table Column Widths
  tableColumnWidths: Record<string, Record<string, number>>;
  setTableColumnWidth: (tableId: string, columnId: string, width: number) => void;
  getTableColumnWidth: (tableId: string, columnId: string) => number | undefined;
  getTableColumnWidthParameters: ({ tableId, columnId, minWidth }: ColumnParametersInput) => TableColumnWidthParameters;

  setExpandedState: (data: Record<string, boolean>[]) => void;
  expanded: Record<string, boolean>[];
};

export const useUiStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // Drawer
      openDrawer: false,
      toggleDrawer: () => set((state) => ({ openDrawer: !state.openDrawer })),

      // Table Column Widths
      tableColumnWidths: {},
      expanded: [],
      setTableColumnWidth: (tableId: string, columnId: string, width: number) =>
        set((state) => ({
          tableColumnWidths: {
            ...state.tableColumnWidths,
            [tableId]: { ...state.tableColumnWidths[tableId], [columnId]: width },
          },
        })),
      getTableColumnWidth: (tableId: string, columnId: string) => get().tableColumnWidths[tableId]?.[columnId],
      setExpandedState: (data) => {
        console.log("called in store" , data)
        set((state) => ({
          ...state.getTableColumnWidth,
          expanded: data,
        }))},
      getTableColumnWidthParameters: ({ tableId, columnId, minWidth }: ColumnParametersInput) => {
        const persistedWidth = get().tableColumnWidths[tableId]?.[columnId];
        return {
          minWidth,
          width: persistedWidth ?? undefined,
          flex: !persistedWidth ? 1 : 0,
        };
      },
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        tableColumnWidths: state.tableColumnWidths,
        expanded: state.expanded,
      }),
    }
  )
);
