import { AtLandmarkIcon } from "@/components/location-icons/AtLandmark";
import { AtLocationIcon } from "@/components/location-icons/AtLocation";
import { AtPointOfInterestIcon } from "@/components/location-icons/AtPointOfInterest";
import Tooltip from "@mui/material/Tooltip";
interface LocationCellProps {
  landmarkName?: Nullable<string>;
  type: AssetGeoType;
  miles?: Nullable<number>;
  direction?: Nullable<string>;
  city?: Nullable<string>;
  state?: Nullable<string>;
  zip?: Nullable<string>;
}

const formatLocation = (city?: Nullable<string>, state?: Nullable<string>, zip?: Nullable<string>): string => {
  const parts = [city, state, zip].filter(Boolean);
  return parts.join(", ");
};

const LandmarkDisplay = ({ name }: { name: Nullable<string> }) => (
  <div className="tw-flex tw-items-center">
    <Tooltip title="Landmark" placement="top">
      <span>
        <AtLandmarkIcon />
      </span>
    </Tooltip>
    <span>{name}</span>
  </div>
);

const PointOfInterestDisplay = ({ name }: { name: Nullable<string> }) => (
  <div className="tw-flex tw-items-center">
    <Tooltip title="POI" placement="top">
      <span>
        <AtPointOfInterestIcon />
      </span>
    </Tooltip>
    <span>{name}</span>
  </div>
);

function LocationDistanceDisplay({
  miles,
  direction,
  city,
  state,
  zip,
}: Pick<LocationCellProps, "miles" | "direction" | "city" | "state" | "zip">) {
  const locationString = formatLocation(city, state, zip);

  return (
    <div className="tw-flex tw-items-center">
      <Tooltip title="Nearby" placement="top">
        <span>
          <AtLocationIcon />
        </span>
      </Tooltip>
      <div>
        <div className="tw-flex tw-items-center">
          {miles ? (
            <>
              <span>{miles?.toFixed(2)}</span>
              <span className="tw-ml-1 tw-text-[10px] tw-text-text-secondary">mi</span>
            </>
          ) : null}
          {direction ? (
            <>
              <span className="tw-ml-2">{direction || "N/A"}</span>
              <span className="tw-ml-1 tw-text-[10px] tw-text-text-secondary">from</span>
            </>
          ) : null}
        </div>
        {locationString && <div className="tw-leading-5">{locationString}</div>}
      </div>
    </div>
  );
}

export function LocationCell(props: LocationCellProps) {
  const { type, landmarkName } = props;
  switch (type) {
    case "CUSTOM":
      return landmarkName ? <LandmarkDisplay name={landmarkName} /> : "";
    case "POI":
      return landmarkName ? <PointOfInterestDisplay name={landmarkName} /> : "";
    case "GENERIC":
      return <LocationDistanceDisplay {...props} />;
    default:
      return "";
  }
}
