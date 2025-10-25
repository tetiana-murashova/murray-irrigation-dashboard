import "chartjs-adapter-date-fns";
import type {
  TimeSeriesChartData,
  TimeSeriesChartOptions,
  LineChartOptionsWithZoom,
} from "../types/chartTypes.js";

import type { Plugin } from "chart.js";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
  zoomPlugin as unknown as Plugin
);

type Props = {
  chartData: TimeSeriesChartData;
  options: TimeSeriesChartOptions;
};

export const TimeSeriesChart = ({ chartData, options }: Props) => {
  const chartRef = useRef<any>(null);
  const [range, setRange] = useState<{ min?: number; max?: number }>({});
  const [fullRange, setFullRange] = useState<{ min?: number; max?: number }>(
    {}
  );
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartRange, setDragStartRange] = useState<{
    min?: number;
    max?: number;
  }>({});

  const zoomOptions: LineChartOptionsWithZoom = React.useMemo(
    () => ({
      ...options,
      plugins: {
        ...options.plugins,
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            drag: {
              enabled: true,
              backgroundColor: "rgba(59,130,246,0.15)",
              borderColor: "rgba(59,130,246,0.8)",
              borderWidth: 1,
            },
            mode: "x",
            onZoomComplete: ({ chart }: any) => updateRange(chart),
          },
          pan: {
            enabled: true,
            mode: "x",
            onPanComplete: ({ chart }: any) => updateRange(chart),
          },
          limits: {
            x: { minRange: 1000 * 60 },
          },
        },
      },
    }),
    [options]
  );

  const updateRange = useCallback((chart: any) => {
    const xScale = chart.scales.x;
    if (xScale) {
      setRange({ min: xScale.min, max: xScale.max });
    }
  }, []);

  const handleResetZoom = () => {
    const chart = chartRef.current;
    if (chart) {
      chart.resetZoom();
      // Update range after reset
      setTimeout(() => updateRange(chart), 100);
    }
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && chartData?.datasets?.[0]?.data?.length) {
      const allX = chartData.datasets.flatMap((d: any) =>
        d.data.map((p: any) => p.x.getTime())
      );
      const min = Math.min(...allX);
      const max = Math.max(...allX);
      setFullRange({ min, max });

      // Initialize range with current view
      updateRange(chart);
    }
  }, [chartData, updateRange]);

  const formatDate = (t?: number) =>
    t ? format(new Date(t), "MMM d, yyyy HH:mm") : "";

  const leftPercent =
    fullRange.min && range.min
      ? ((range.min - fullRange.min) / (fullRange.max! - fullRange.min)) * 100
      : 0;
  const widthPercent =
    fullRange.min && range.min
      ? ((range.max! - range.min!) / (fullRange.max! - fullRange.min)) * 100
      : 100;

  // Improved drag navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartRange({ ...range });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartX(0);
    setDragStartRange({});
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (
        !isDragging ||
        !chartRef.current ||
        !fullRange.min ||
        !range.min ||
        !dragStartRange.min
      )
        return;

      const chart = chartRef.current;
      const dx = e.clientX - dragStartX;
      const bar = e.currentTarget as HTMLDivElement;
      const barWidth = bar.clientWidth;
      const totalDuration = fullRange.max! - fullRange.min!;
      const shift = (dx / barWidth) * totalDuration;

      const newMin = dragStartRange.min! + shift;
      const newMax = dragStartRange.max! + shift;

      // Keep within bounds
      const boundedMin = Math.max(fullRange.min!, newMin);
      const boundedMax = Math.min(fullRange.max!, newMax);

      // Ensure we maintain the same zoom level
      const finalMin = boundedMin;
      const finalMax = boundedMin + (dragStartRange.max! - dragStartRange.min!);

      if (finalMax <= fullRange.max!) {
        // Use the zoom plugin's method to update the view
        if (chart.zoomScale) {
          chart.zoomScale("x", { min: finalMin, max: finalMax });
          updateRange(chart);
        }
      }
    },
    [isDragging, fullRange, range, dragStartX, dragStartRange, updateRange]
  );

  return (
    <div className="relative h-[460px] flex flex-col select-none">
      {chartData ? (
        <>
          <div className="text-sm text-slate-600 mb-2">
            {range.min && range.max ? (
              <>
                Viewing:{" "}
                <span className="font-medium">{formatDate(range.min)}</span> →{" "}
                <span className="font-medium">{formatDate(range.max)}</span>
              </>
            ) : (
              "Viewing full range"
            )}
          </div>

          <div className="flex-1">
            <Line ref={chartRef} data={chartData} options={zoomOptions} />
          </div>

          {/* Interactive timeline bar */}
          <div
            className="relative mt-3 h-3 rounded-full bg-sky-200 overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="absolute top-0 h-full bg-white rounded-full shadow-inner border border-sky-300"
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                transition: isDragging ? "none" : "left 0.1s, width 0.1s",
              }}
            ></div>
          </div>
        </>
      ) : (
        <p>No data</p>
      )}

      <button
        onClick={handleResetZoom}
        className="absolute top-2 right-2 bg-sky-600 text-white text-sm px-3 py-1 rounded shadow hover:bg-sky-700"
      >
        Reset Zoom
      </button>
    </div>
  );
};
