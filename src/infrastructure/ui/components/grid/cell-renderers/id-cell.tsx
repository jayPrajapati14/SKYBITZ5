import { Link } from "react-router-dom";
import { getAssetUrl } from "@/domain/utils/url";

export function IdCell({ assetId }: { assetId: string | number }) {
  const url = getAssetUrl();
  return (
    <div className="tw-overflow-hidden tw-text-ellipsis">
      <Link target="_blank" to={`${url}=${assetId}`} className="tw-font-normal tw-text-primary tw-underline">
        {assetId}
      </Link>
    </div>
  );
}
