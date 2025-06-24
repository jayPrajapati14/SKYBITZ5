import { Source, Layer } from "react-map-gl";
import { useYardPolygon } from "../../hooks/use-yard-polygon";

type YardPolygonProps = {
  coordinates: Coordinate[][];
  color?: string;
  opacity?: number;
};

export const YardPolygon = ({ coordinates, color = "#9747FF", opacity = 0.2 }: YardPolygonProps) => {
  const { polygonData, layers } = useYardPolygon({ coordinates, color, opacity });

  return (
    <Source id="polygon-source" type="geojson" data={polygonData}>
      {layers.map((layer) => (
        <Layer key={layer.id} {...layer} />
      ))}
    </Source>
  );
};
