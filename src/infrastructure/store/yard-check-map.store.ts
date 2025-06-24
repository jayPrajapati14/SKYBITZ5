import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getCurrentUserId } from "@/domain/services/user/user.service";

const VERSION = 1;

export type YardCheckMapState = {
  isMapExpanded: boolean;
  height: number;
  actions: {
    setMapExpanded: (isExpanded: boolean) => void;
    toggleMapExpanded: () => void;
    setMapHeight: (height: number) => void;
  };
};

const userId = getCurrentUserId();

export const useYardCheckMapStore = create<YardCheckMapState>()(
  persist(
    (set) => ({
      isMapExpanded: false,
      height: 500,
      actions: {
        setMapExpanded(isExpanded) {
          set((state) => ({
            ...state,
            isMapExpanded: isExpanded,
          }));
        },
        toggleMapExpanded() {
          set((state) => ({
            ...state,
            isMapExpanded: !state.isMapExpanded,
          }));
        },
        setMapHeight(height) {
          set((state) => ({
            ...state,
            height: height,
          }));
        },
      },
    }),
    {
      partialize: (state) => ({
        isMapExpanded: state.isMapExpanded,
        height: state.height,
      }),
      name: `${userId}:yard-check-map-view`,
      version: VERSION,
    }
  )
);

export const useYardCheckMapActions = () => useYardCheckMapStore((state) => state.actions);
export const useIsMapExpanded = () => useYardCheckMapStore((state) => state.isMapExpanded);
export const useMapHeight = () => useYardCheckMapStore((state) => state.height);
