import { useMemo } from "react";
import { CLUSTER_BUFFER, CLUSTER_MAX_ZOOM, CLUSTER_RADIUS } from "../../utils/constants";
import { Layer, Source } from "react-map-gl";
import { SymbolLayerSpecification } from "mapbox-gl";

interface AssetsClusterProps {
  assets: AssetMarker[];
  assetId: Nullable<string>;
  idleTime: number;
}

const UNCLUSTERED_POINT_LAYER = (excludeAssetId: string | null): SymbolLayerSpecification => ({
  id: "unclustered-point",
  type: "symbol",
  source: "points",
  filter: ["all", ["!", ["has", "point_count"]], excludeAssetId ? ["!=", ["get", "assetId"], excludeAssetId] : true],
  layout: {
    "icon-image": [
      "case",
      ["<=", ["get", "idleTime"], 3],
      "custom-marker-blue",
      ["all", [">", ["get", "idleTime"], 3], ["<=", ["get", "idleTime"], 7]],
      "custom-marker-yellow",
      "custom-marker-red",
    ],
    "icon-size": 0.75,
    "icon-allow-overlap": true,
    "icon-ignore-placement": true,
  },
});

export function AssetsCluster({ assets, assetId }: AssetsClusterProps) {
  const points = useMemo(() => assets, [assets]);
  const geojson = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          idleTime: point.idleTimeHours / 24,
          assetId: point.assetId,
          id: point.assetId,
        },
      })),
    }),
    [points]
  );

  return (
    <>
      <Source
        id="points"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={CLUSTER_MAX_ZOOM}
        clusterRadius={CLUSTER_RADIUS}
        clusterProperties={{
          low: ["+", ["case", ["<=", ["get", "idleTime"], 3], 1, 0]],
          medium: ["+", ["case", ["all", [">", ["get", "idleTime"], 3], ["<=", ["get", "idleTime"], 7]], 1, 0]],
          high: ["+", ["case", ["all", [">", ["get", "idleTime"], 7]], 1, 0]],
        }}
        buffer={CLUSTER_BUFFER}
      >
        <Layer {...UNCLUSTERED_POINT_LAYER(assetId)} />
      </Source>
    </>
  );
}
