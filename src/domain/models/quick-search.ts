declare global {
  export type QuickSearchAsset = {
    id: number;
    assetId: Nullable<string>;
    assetType: Nullable<string>;
    deviceSerialNumber: Nullable<string>;
    deviceId: Nullable<number>;
  };

  interface QuickSearchResult {
    assets: QuickSearchAsset[];
  }
}
