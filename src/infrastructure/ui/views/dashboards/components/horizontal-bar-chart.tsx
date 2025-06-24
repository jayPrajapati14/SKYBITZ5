import Chart from "react-apexcharts";

import { ApexOptions } from "apexcharts";

type HorizontalBarChartProps = {
  dataset: Array<{ label: string; value: number; total: number }>;
};

export const HorizontalBarChart = ({ dataset }: HorizontalBarChartProps) => {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        barHeight: 28,
      },
    },
    grid: {
      show: false,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontSize: "13px",
        },
      },
    },
  };

  const series = [{ name: "Assets", data: dataset.map((item) => ({ x: item.label, y: item.value })) }];

  const heightPerItem = 60;
  const chartHeight = dataset.length * heightPerItem;

  return <Chart options={options} series={series} type="bar" height={chartHeight} />;
};
