import { Popup } from "react-map-gl";
import { IdCell } from "@/components/grid/cell-renderers/id-cell";
import { formatHours } from "@/components/grid/cell-renderers/time-period-cell";
import { useGlobalStyles } from "@/hooks/use-global-styles";
import { getIdleTimeColour } from "../../utils/marker-utils";

interface AssetPopupProps {
  assetId: string;
  idleTime: number;
  longitude: number;
  latitude: number;
  onClose: () => void;
}

export function AssetPopup({ assetId, idleTime, longitude, latitude, onClose }: AssetPopupProps) {
  useGlobalStyles(
    "mapbox-popup",
    `
        :root {
              --popup-border-color:${getIdleTimeColour(idleTime)}
        }
        .mapboxgl-popup-close-button{padding: 0 5px;font-size: 24px;color: rgba(0, 0, 0, 0.6);top: 12px;right: 13px;border-radius: 100%;height: 25px;padding: 0 0 4px;width: 25px;}
        .mapboxgl-popup-content{border:2px solid var(--popup-border-color);min-width: 220px;border-radius: 7px;box-shadow: none;}
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip{border-top-color: var(--popup-border-color) !important}
        .mapboxgl-popup-content a{text-decoration: none !important;font-weight: 500;}
        .mapboxgl-popup-tip{border: 9px solid transparent;height: 0;width: 0;z-index: 0;transform: rotate(112deg);bottom: 5px;position: relative;}
        .mapboxgl-popup{z-index:12}
        `
  );
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      offset={-18}
    >
      <div className="tw-max-w-xs tw-rounded-lg tw-bg-white tw-p-1">
        <div className="tw-mb-2 tw-flex tw-w-40 tw-truncate tw-text-sm tw-font-medium tw-text-text-secondary">
          <div className="tw-shrink-0">ID:</div>
          <div className="tw-flex-1 tw-pl-2">
            <IdCell assetId={assetId} />
          </div>
        </div>
        <div className="tw-mt-3 tw-grid tw-grid-cols-2">
          <div>Idle Time</div>
          <div>
            <span>{formatHours(idleTime, "IDLE").number}</span>
            <span className="tw-ml-px tw-text-[10px] tw-font-normal tw-text-text-secondary">d</span>
          </div>
        </div>
      </div>
    </Popup>
  );
}
