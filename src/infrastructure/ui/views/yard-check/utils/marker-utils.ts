import mapboxgl, { Marker, MapEvent, LngLat } from "mapbox-gl";
import { MapRef } from "react-map-gl";
import { getCustomMarkerSVG } from "./get-custom-marker";
import { IDLE_ASSET_COLOR, DEFAULT_MAP } from "./constants";

const markers: Record<string, Marker> = {};
let markersOnScreen: Record<string, Marker> = {};
const CUSTOM_MARKERS = {
  "custom-marker-red": getCustomMarkerSVG(IDLE_ASSET_COLOR.HIGH),
  "custom-marker-yellow": getCustomMarkerSVG(IDLE_ASSET_COLOR.MID),
  "custom-marker-blue": getCustomMarkerSVG(IDLE_ASSET_COLOR.LOW),
};

export function updateMarkers(event: MapEvent) {
  const map = event.target;
  const features = map.querySourceFeatures("points") as GeoJSON.Feature<GeoJSON.Point>[];

  const newMarkers: Record<string, Marker> = {};

  for (const feature of features) {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    if (!props?.cluster) continue;

    const id = props.cluster_id;
    let marker = markers[id];
    if (!marker) {
      const el = createDonutChart(props);
      marker = markers[id] = new Marker({ element: el }).setLngLat(new LngLat(coords[0], coords[1]));
    }
    newMarkers[id] = marker;

    if (!markersOnScreen[id]) marker.addTo(map);
  }

  for (const id in markersOnScreen) {
    if (!newMarkers[id]) markersOnScreen[id].remove();
  }
  markersOnScreen = newMarkers;
}

export function createDonutChart(props: Record<string, number>) {
  const colors = [IDLE_ASSET_COLOR.LOW, IDLE_ASSET_COLOR.MID, IDLE_ASSET_COLOR.HIGH];
  const offsets: number[] = [];
  const counts: number[] = [props.low, props.medium, props.high];
  let total = 0;

  for (const count of counts) {
    offsets.push(total);
    total += count;
  }

  const totalString =
    total >= 1_000_000
      ? `${Math.floor(total / 1_000_000)}M+`
      : total >= 1_000
        ? `${Math.floor(total / 1_000)}k+`
        : total.toLocaleString();

  const totalLength = totalString.length;
  const fontSize = 16;
  const r = Math.max(22, 4 + totalLength * 8);
  const r0 = Math.round(r * 0.6);
  const w = r * 2;

  const donutsSegments = counts
    .map((count, index) => donutSegment(offsets[index] / total, (offsets[index] + count) / total, r, r0, colors[index]))
    .join("");

  const svgString = `
    <svg width="${w}" height="${w}" viewbox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">
      <circle cx="${r}" cy="${r}" r="${w / 2 - 4}" fill="white" />
      ${donutsSegments}
      <text dominant-baseline="central" transform="translate(${r}, ${r})">${totalString}</text>
    </svg>
  `;

  const el = document.createElement("div");
  el.innerHTML = svgString;
  return el;
}

function donutSegment(start: number, end: number, r: number, r0: number, color: string) {
  if (end - start === 1) end -= 0.000001;
  const a0 = 2 * Math.PI * (start - 0.25);
  const a1 = 2 * Math.PI * (end - 0.25);
  const x0 = Math.cos(a0);
  const y0 = Math.sin(a0);
  const x1 = Math.cos(a1);
  const y1 = Math.sin(a1);
  const largeArc = end - start > 0.5 ? 1 : 0;

  return `<path d="M ${r + r0 * x0} ${r + r0 * y0} L ${r + r * x0} ${
    r + r * y0
  } A ${r} ${r} 0 ${largeArc} 1 ${r + r * x1} ${r + r * y1} L ${
    r + r0 * x1
  } ${r + r0 * y1} A ${r0} ${r0} 0 ${largeArc} 0 ${r + r0 * x0} ${r + r0 * y0}" fill="${color}" stroke="white" stroke-width="1" />`;
}

export function clearMarkers() {
  for (const id in markersOnScreen) {
    markersOnScreen[id].remove();
    delete markersOnScreen[id];
    delete markers[id];
  }
}

export function adjustMapCenter(map: MapRef, assets: AssetMarker[]) {
  if (assets.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    assets.forEach((asset) => {
      bounds.extend([asset.longitude, asset.latitude]);
    });
    map.fitBounds(bounds, {
      padding: {
        top: 65,
        right: 17,
        bottom: 17,
        left: 17,
      },
      maxZoom: 12,
      duration: 500,
    });
  } else {
    map.easeTo({
      center: [DEFAULT_MAP.LONGITUDE, DEFAULT_MAP.LATITUDE], //default location
      zoom: DEFAULT_MAP.ZOOM,
      duration: 500,
    });
  }
}

export function loadCustomMarkers(map: MapRef) {
  if (!map) return;

  Object.entries(CUSTOM_MARKERS).forEach(([name, svg]) => {
    if (map.hasImage(name)) return;
    const img = new Image(50, 60);
    img.onload = () => {
      if (map && !map.hasImage(name)) {
        map.addImage(name, img);
      }
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export function getIdleTimeColour(hours: number): string {
  if (hours > 168) return IDLE_ASSET_COLOR.HIGH;
  if (hours > 72) return IDLE_ASSET_COLOR.MID;
  return IDLE_ASSET_COLOR.LOW;
}
