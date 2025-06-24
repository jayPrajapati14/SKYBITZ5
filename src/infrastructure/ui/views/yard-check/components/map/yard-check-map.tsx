import { MapRef } from "react-map-gl";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRef, useEffect, useMemo, useState } from "react";
import { useYardCheckMapActions, useMapHeight } from "@/store/yard-check-map.store";
import { Map, NavigationControl, FullscreenControl } from "react-map-gl";
import { AssetsCluster } from "./assets-cluster";
import { useYardCheckFilters } from "@/store/yard-check.store";
import { IdleTimeLegend } from "@/views/yard-check/components/idle-time-legend";
import { MapHeaderBar } from "./map-header";
import { useGetYardCheckMapAssets } from "../../hooks/use-get-yard-check-map-assets";
import { YardPolygon } from "./yard-polygon";
import { updateMarkers, adjustMapCenter, loadCustomMarkers, clearMarkers } from "../../utils/marker-utils";
import { AssetPopup } from "./asset-popup";
import { Resizable } from "re-resizable";
import { VerticalAlignCenter } from "@mui/icons-material";
import { DEFAULT_MAP } from "../../utils/constants";

const HorizontalLineHandle = () => {
  return (
    <div className="tw-relative tw-mt-4 tw-flex tw-h-[2px] tw-flex-col tw-items-center tw-bg-grey-200">
      <VerticalAlignCenter
        fontSize="medium"
        className="tw-absolute tw-bottom-[-11px] tw-rounded-full tw-border-2 tw-border-grey-200 tw-bg-white tw-text-grey-200"
      />
    </div>
  );
};

export const YardCheckMap = ({ isExpanded }: { isExpanded: boolean }) => {
  const mapboxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const { toggleMapExpanded, setMapHeight } = useYardCheckMapActions();
  const mapRef = useRef<MapRef | null>(null);
  const mapHeight = useMapHeight();
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    assetId: string;
    idleTime: number;
  } | null>(null);
  const { asset, location, operational, sensor } = useYardCheckFilters(true);
  const assetsQuery = useGetYardCheckMapAssets({
    landmarkIds: location.names?.map((item) => item.id) ?? [],
    landmarkGroups: location.groups?.map((item) => item.id) ?? [],
    landmarkTypes: location.types?.map((item) => item.id) ?? [],
    excludedAssetIds: asset.excludedIds?.map((item) => item.id) ?? [],
    ids: asset.ids?.map((item) => item.id) ?? [],
    types: asset.types?.map((item) => item.id) ?? [],
    countries: location.countries?.map((item) => item.id) ?? [],
    states: location.states?.map((item) => item.id) ?? [],
    zipCode: location.zipCode,
    lastReported: operational.lastReported,
    cargoStatuses: sensor.cargoStatuses,
    motionStatuses: sensor.motionStatuses,
    idleTime: operational.idleTime,
    byTextSearch: asset.byTextSearch,
  });

  const assets = useMemo(() => assetsQuery.data?.flatMap((landmark) => landmark.assets) ?? [], [assetsQuery.data]);
  const landmarksCoordinates = useMemo(
    () => assetsQuery.data?.map((landmark) => landmark.boundary).filter((boundary) => boundary.length > 0) ?? [],
    [assetsQuery.data]
  );

  useEffect(() => {
    mapRef.current?.resize();
    setPopupInfo(null);
    if (mapRef.current) adjustMapCenter(mapRef.current as MapRef, assets);
  }, [isExpanded, assets]);

  const handlePointClick = (e: mapboxgl.MapMouseEvent) => {
    e.originalEvent.stopPropagation();
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];

      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
      const { assetId, idleTime } = feature.properties as {
        assetId: string;
        idleTime: number;
      };

      setPopupInfo({
        longitude: coordinates[0],
        latitude: coordinates[1],
        assetId,
        idleTime: idleTime * 24,
      });
    }
  };

  const handleMapClick = () => {
    setPopupInfo(null);
  };

  const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
    e.target.getCanvas().style.cursor = "pointer";
  };
  const handleMouseLeave = (e: mapboxgl.MapMouseEvent) => {
    e.target.getCanvas().style.cursor = "";
  };

  if (!mapboxAccessToken) {
    console.error("MAPBOX_ACCESS_TOKEN variable is missing");
    return null;
  }

  return (
    <>
      <MapHeaderBar isMapExpanded={isExpanded} onToogleMapBar={toggleMapExpanded} />
      <Resizable
        defaultSize={{
          height: mapHeight,
        }}
        minHeight={300}
        enable={{
          bottom: true,
        }}
        onResize={(_e, _direction, ref, _d) => {
          mapRef.current?.resize();
          adjustMapCenter(mapRef.current as MapRef, assets);
          setMapHeight(ref.offsetHeight);
        }}
        handleComponent={{ bottom: <HorizontalLineHandle /> }}
        handleStyles={{
          bottom: {
            bottom: "-13px",
          },
        }}
      >
        <Map
          ref={mapRef}
          logoPosition="bottom-right"
          mapboxAccessToken={mapboxAccessToken}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          attributionControl={false}
          onClick={(e) => {
            handleMapClick();
            if (e.features && e.features.length > 0) {
              const layerId = e.features[0].layer?.id;
              if (layerId === "unclustered-point") {
                handlePointClick(e);
              }
            }
          }}
          reuseMaps
          optimizeForTerrain={false}
          interactiveLayerIds={["unclustered-point"]}
          onRender={(e) => {
            updateMarkers(e);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onSourceData={(e) => {
            if (e.sourceId === "points" && e.isSourceLoaded) {
              clearMarkers();
              loadCustomMarkers(mapRef.current as MapRef);
            }
          }}
          initialViewState={{
            latitude: DEFAULT_MAP.LATITUDE,
            longitude: DEFAULT_MAP.LONGITUDE,
            zoom: DEFAULT_MAP.ZOOM,
          }}
        >
          {assetsQuery.isFetching ? (
            <Backdrop
              className="tw-z-1 !tw-absolute !tw-inset-0 !tw-bg-gray-100 !tw-bg-opacity-25 tw-text-primary"
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <>
              {/* show landmark polygons */}
              {landmarksCoordinates.length > 0 ? <YardPolygon coordinates={landmarksCoordinates} /> : null}

              {/* show assets clusters and pins */}
              <AssetsCluster assets={assets} assetId={popupInfo?.assetId ?? null} idleTime={popupInfo?.idleTime ?? 0} />

              {/* on click pin display asset info */}
              {popupInfo ? (
                <AssetPopup
                  idleTime={popupInfo.idleTime}
                  assetId={popupInfo.assetId}
                  latitude={popupInfo.latitude}
                  longitude={popupInfo.longitude}
                  onClose={() => setPopupInfo(null)}
                />
              ) : null}
            </>
          )}
          {isExpanded && (
            <>
              <NavigationControl position="bottom-right" showCompass={false} />
              <FullscreenControl position="bottom-right" />
            </>
          )}
        </Map>

        {isExpanded && (
          <div className="tw-absolute tw-bottom-2 tw-left-2">
            <IdleTimeLegend />
          </div>
        )}
      </Resizable>
    </>
  );
};
