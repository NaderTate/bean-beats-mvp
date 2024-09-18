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
  Filler // Register filler for background color fill
);

export default function CustomLineChart({ data }: any) {
  // const chartData = {
  //   labels: [
  //     "JAN",
  //     "FEB",
  //     "MAR",
  //     "APR",
  //     "MAY",
  //     "JUN",
  //     "JUL",
  //     "AUG",
  //     "SEP",
  //     "OCT",
  //     "NOV",
  //     "DEC",
  //   ],
  //   datasets: [
  //     {
  //       label: "Monthly Stats",
  //       data: [
  //         1000, 1200, 1500, 1300, 1600, 1400, 1800, 405, 2000, 1700, 1900, 2100,
  //       ],
  //       fill: "start", // Enable area fill under the line
  //       backgroundColor: "rgba(217, 162, 132, 0.3)", // Light brown color with transparency
  //       borderColor: "#D97333", // Line color matching brownish orange
  //       borderWidth: 2,
  //       tension: 0.4, // Make the line smooth
  //       pointRadius: 5, // Increase point size for visibility
  //       pointBackgroundColor: "#D97333", // Same as the line color
  //       pointBorderColor: "#FFF",
  //       pointHoverRadius: 6,
  //       pointHoverBackgroundColor: "#000", // Tooltip point color
  //       pointHoverBorderColor: "#FFF",
  //       hoverBackgroundColor: "#000",
  //       pointHitRadius: 10, // Increase hitbox for easier hover
  //     },
  //   ],
  // };

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
