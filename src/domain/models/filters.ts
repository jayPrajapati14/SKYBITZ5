import {
  AccruedDistanceAssetSortByField,
  YardCheckAssetSortByField,
  GenericAssetSortByField,
  IdleAssetSortByField,
  MovingAssetSortByField,
} from "@/domain/services/asset/asset.service";

declare global {
  export type YardCheckFilters = {
    landmark: {
      names?: Landmark[];
      types?: LandmarkType[];
      groups?: LandmarkGroup[];
    };
    asset: {
      ids?: AssetId[];
      types?: AssetType[];
      excludedIds?: AssetId[];
      byTextSearch?: string;
    };
    location: {
      names?: Landmark[];
      types?: LandmarkType[];
      groups?: LandmarkGroup[];
      countries?: Country[];
      states?: State[];
      zipCode?: string;
    };
    sensor: {
      cargoStatuses?: string[];
      volumetricStatuses?: string[];
      motionStatuses?: string[];
    };
    operational: {
      assetLocationType?: AssetLocationType;
      idleTime?: number;
      lastReported?: number;
    };
    display: {
      sortBy?: {
        field: YardCheckAssetSortByField;
        order: SortDirection;
      };
    };
  };

  export type AccruedDistanceFilters = {
    asset: {
      ids?: AssetId[];
    };
    operational: {
      dateRange: {
        from: Date;
        to: Date;
      };
    };
    display: {
      sortBy?: {
        field: AccruedDistanceAssetSortByField;
        order: SortDirection;
      };
    };
  };

  export type GenericAssetFilters = {
    asset: {
      ids?: AssetId[];
      types?: AssetType[];
      excludedIds?: AssetId[];
      byTextSearch?: string;
    };
    location: {
      names?: Landmark[];
      types?: LandmarkType[];
      groups?: LandmarkGroup[];
      countries?: Country[];
      states?: State[];
      zipCode?: string;
    };
    sensor: {
      cargoStatuses?: string[];
      volumetricStatuses?: string[];
      motionStatuses?: string[];
    };
    operational: {
      assetLocationType?: AssetLocationType;
      idleTime?: number;
      lastReported?: number;
    };
    display: {
      sortBy?: {
        field: GenericAssetSortByField;
        order: SortDirection;
      };
    };
  };

  export type IdleAssetFilters = {
    asset: {
      ids?: AssetId[];
      types?: AssetType[];
      excludedIds?: AssetId[];
      byTextSearch?: string;
    };
    location: {
      names?: Landmark[];
      types?: LandmarkType[];
      groups?: LandmarkGroup[];
      countries?: Country[];
      states?: State[];
      zipCode?: string;
    };
    sensor: {
      cargoStatuses?: string[];
      volumetricStatuses?: string[];
      motionStatuses?: string[];
    };
    operational: {
      assetLocationType?: AssetLocationType;
      idleTime?: number;
      lastReported?: number;
    };
    display: {
      sortBy?: {
        field: IdleAssetSortByField;
        order: SortDirection;
      };
    };
  };

  export type MovingAssetFilters = {
    asset: {
      ids?: AssetId[];
      types?: AssetType[];
      excludedIds?: AssetId[];
      byTextSearch?: string;
    };
    location: {
      names?: Landmark[];
      types?: LandmarkType[];
      groups?: LandmarkGroup[];
      countries?: Country[];
      states?: State[];
      zipCode?: string;
    };
    sensor: {
      cargoStatuses?: string[];
      volumetricStatuses?: string[];
      motionStatuses?: string[];
    };
    operational: {
      lastReported?: number;
      assetLocationType?: AssetLocationType;
    };
    display: {
      sortBy?: {
        field: MovingAssetSortByField;
        order: SortDirection;
      };
    };
  };
}
