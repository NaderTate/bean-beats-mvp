"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Needed to fill the area under the line
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CustomLineChart({ data }: any) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to control height
    scales: {
      x: {
        grid: {
          display: false, // Disable grid lines on x-axis
        },
      },
      y: {
        grid: {
          drawBorder: false, // Disable grid line borders
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1000,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.raw}`;
          },
        },
        backgroundColor: "#3B2F2F", // Tooltip background color
        titleFont: {
          family: "Arial",
          size: 12,
        },
        bodyFont: {
          family: "Arial",
          size: 12,
        },
        cornerRadius: 4,
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      {/* @ts-ignore */}
      <Line data={data} options={chartOptions} />
    </div>
  );
}
