import { useCallback } from "react";
import { MapRef, MapMouseEvent } from "react-map-gl";

interface ClusterFeatureProperties {
  cluster: boolean;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string;
}

interface ClusterFeature extends GeoJSON.Feature<GeoJSON.Point, ClusterFeatureProperties> {
  geometry: GeoJSON.Point;
}

export const useMapInteractions = (mapRef: React.RefObject<MapRef>) => {
  const handleClick = useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0] as ClusterFeature | undefined;
      if (!feature?.properties?.cluster) return;

      const map = mapRef.current?.getMap();
      if (!map) return;

      const source = map.getSource("points") as mapboxgl.GeoJSONSource | undefined;
      if (!source) return;

      const clusterId = feature.properties.cluster_id;
      const coordinates = feature.geometry.coordinates as [number, number];

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) {
          console.error("Cluster zoom error:", err);
          return;
        }

        map.easeTo({
          center: coordinates,
          zoom,
          duration: 500,
        });
      });
    },
    [mapRef]
  );

  return { mapRef, handleClick };
};
