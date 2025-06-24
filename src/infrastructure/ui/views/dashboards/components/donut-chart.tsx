import Chart from "react-apexcharts";
import { Skeleton } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { ReactNode } from "react";
import { grey } from "@mui/material/colors";

type DonutChartProps = {
  children?: ReactNode;
  dataset: Array<{ label: string; value: number; color: string }>;
  loading?: boolean;
};

type ChartContentProps = {
  options: ApexOptions;
  series: number[];
  children?: ReactNode;
};

const RenderChartContent = ({ options, series, children }: ChartContentProps) => {
  return (
    <>
      <Chart options={options} series={series} type="donut" />
      <div className="tw-absolute tw-left-1/2 tw-top-1/2 tw--translate-x-1/2 tw--translate-y-1/2 tw-transform tw-text-center">
        {children}
      </div>
    </>
  );
};

export function DonutChart({ loading = false, dataset, children }: DonutChartProps) {
  const series = dataset.map((item) => item.value);
  const isAllZero = series.every((value) => value === 0);
  const options: ApexOptions = {
    labels: dataset.map((item) => item.label),
    colors: isAllZero ? [grey[200]] : dataset.map((item) => item.color),
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    states: {
      hover: { filter: { type: "none" } },
      active: { filter: { type: "none" } },
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: { size: "85%" },
      },
    },
    chart: {
      animations: {
        enabled: false,
      },
    },
    tooltip: {
      cssClass: "tw-ml-20",
    },
  };
  const chartSeries = isAllZero ? [1] : series;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {loading ? (
        <Skeleton height="100%" width="100%" animation="wave">
          <RenderChartContent options={options} series={chartSeries} children={children} />
        </Skeleton>
      ) : (
        <RenderChartContent options={options} series={chartSeries} children={children} />
      )}
    </div>
  );
}
