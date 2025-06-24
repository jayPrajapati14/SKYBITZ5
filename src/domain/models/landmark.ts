declare global {
  export type LandmarkType = {
    id: number;
    name?: string;
  };

  export type LandmarkGroup = {
    id: number;
    name?: string;
  };

  export type Landmark = {
    id: number;
    name?: string;
    typeId?: number;
    groupId?: number;
    latitude?: number;
    longitude?: number;
    boundary?: Coordinate[];
  };

  export type LandmarkAssetStats = Landmark & {
    emptyAssets: number;
    totalAssets: number;
  };

  export type Coordinate = {
    latitude: number;
    longitude: number;
  };
}
