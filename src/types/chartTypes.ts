import type { ChartData, ChartOptions } from "chart.js";

export type ZoomPluginOptions = {
  zoom?: {
    wheel?: { enabled: boolean };
    pinch?: { enabled: boolean };
    drag?: {
      enabled: boolean;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
    };
    mode?: "x" | "y" | "xy";
    onZoomComplete?: (context: any) => void;
  };
  pan?: {
    enabled: boolean;
    mode?: "x" | "y" | "xy";
  };
  limits?: Record<string, unknown>;
};

export type LineChartOptionsWithZoom = Omit<ChartOptions<"line">, "plugins"> & {
  plugins?: NonNullable<ChartOptions<"line">["plugins"]> & {
    zoom?: ZoomPluginOptions;
  };
};

export type TimeSeriesDataset = {
  label: string;
  data: { x: string | number | Date; y: number }[];
  borderColor: string;
  backgroundColor: string;
  borderWidth: number;
  pointRadius: number;
};

export type Datasets = TimeSeriesDataset[];

export type TimeSeriesChartData = ChartData<
  "line",
  { x: string | number | Date; y: number }[],
  unknown
> | null;

export type TimeSeriesChartOptions = ChartOptions<"line">;
