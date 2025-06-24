import { grey } from "@mui/material/colors";
import { Skeleton, Tooltip } from "@mui/material";

type KpiValueProps = {
  value: number | string;
  color: string;
};

const KpiValue = ({ value, color }: KpiValueProps) => {
  const getValueColor = () => (value !== 0 ? color : grey[500]);
  return (
    <div
      style={{ "--color": getValueColor() } as React.CSSProperties}
      className="tw-text-4xl tw-font-medium tw-text-[--color]"
    >
      {value.toLocaleString()}
    </div>
  );
};

type KpiTitleProps = {
  title: string;
};

const KpiTitle = ({ title }: KpiTitleProps) => {
  return title.length > 26 ? (
    <Tooltip title={title}>
      <div className="tw-truncate tw-text-sm">{title}</div>
    </Tooltip>
  ) : (
    <div className="tw-text-sm">{title}</div>
  );
};

type KpiContentProps = {
  value: number | string;
  title: string;
  color: string;
};

const KpiContent = ({ value, title, color }: KpiContentProps) => {
  const getValueColor = () => (value !== 0 ? color : grey[500]);

  return (
    <>
      <KpiValue value={value} color={getValueColor()} />
      <KpiTitle title={title} />
    </>
  );
};

type KpiProps = {
  title: string;
  value: number | string;
  color: string;
  borderColor?: string;
  loading?: boolean;
};

export function Kpi({ title, value, color, borderColor = color, loading = false }: KpiProps) {
  const getValueColor = () => (value !== 0 ? borderColor : grey[100]);
  const containerStyles = {
    "--color": color,
    "--border-color": getValueColor(),
  } as React.CSSProperties;

  const baseClasses =
    "tw-flex tw-w-full tw-flex-col tw-gap-1 tw-rounded-md tw-border-l-[5px] tw-border-l-[--border-color] tw-bg-black/5 tw-px-2 tw-py-3.5";

  return loading ? (
    <Skeleton height="100%" width="100%">
      <div style={containerStyles} className={baseClasses}>
        <KpiContent value={value} title={title} color={color} />
      </div>
    </Skeleton>
  ) : (
    <div style={containerStyles} className={baseClasses}>
      <KpiContent value={value} title={title} color={color} />
    </div>
  );
}

Kpi.Value = KpiValue;
Kpi.Title = KpiTitle;
