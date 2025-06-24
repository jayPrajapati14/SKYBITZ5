import PauseCircleOutlineOutlinedIcon from "@mui/icons-material/PauseCircleOutlineOutlined";
export const IdleTimeLegend = () => {
  return (
    <div className="tw-flex tw-flex-col tw-gap-3 tw-rounded-sm tw-bg-white tw-p-2 tw-shadow-xl">
      <div className="tw-flex tw-items-center tw-gap-1">
        <div className="tw-text-opacity-56 tw-flex tw-size-6 tw-items-center tw-justify-center tw-text-text-primary">
          <PauseCircleOutlineOutlinedIcon fontSize="small" />
        </div>
        <div className="tw-text-sm">Idle Time</div>
      </div>

      <div className="tw-space-y-2">
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-size-4 tw-bg-red-500"></div>
          <div className="tw-text-xs">High: 7+ d</div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-size-4 tw-bg-orange-400"></div>
          <div className="tw-text-xs">Med: 3-7 d</div>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-size-4 tw-bg-blue-400"></div>
          <div className="tw-text-xs">Low: 0-3 d</div>
        </div>
      </div>
    </div>
  );
};
