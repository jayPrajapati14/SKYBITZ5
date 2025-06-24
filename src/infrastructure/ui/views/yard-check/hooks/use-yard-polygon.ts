import { FillLayerSpecification, LineLayerSpecification } from "mapbox-gl";

interface YardPolygonProps {
  coordinates: Coordinate[][];
  color: string;
  opacity: number;
}

export const useYardPolygon = ({ coordinates, color, opacity }: YardPolygonProps) => {
  const polygonData = {
    type: "FeatureCollection",
    features: coordinates
      .filter((coordinates) => coordinates && coordinates.length > 0)
      .map((coordinates, index) => ({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [coordinates.map(({ latitude, longitude }) => [longitude, latitude])],
        },
        properties: {
          id: `polygon-${index}`,
        },
      })),
  };

  const polygonLayer: FillLayerSpecification = {
    id: "polygon-layer",
    type: "fill",
    source: "polygon-source",
    paint: {
      "fill-color": color,
      "fill-opacity": opacity,
      "fill-outline-color": color,
    },
  };

  const polygonBorderLayer: LineLayerSpecification = {
    id: "polygon-border-layer",
    type: "line",
    source: "polygon-source",
    paint: {
      "line-color": color,
      "line-opacity": 0.5,
      "line-width": 1.5,
    },
  };

  return {
    polygonData,
    layers: [polygonLayer, polygonBorderLayer],
  };
};
