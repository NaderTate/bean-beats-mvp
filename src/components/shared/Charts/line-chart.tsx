"use client";
import React from "react";
import Image from "next/image";
// interpolation chart
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: any = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: {
      display: true,
      text: "Monthly Stats",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
    x: {
      display: true,
      position: "bottom",
    },
  },
};

// daily sales

export default function LineChart({ data }: any) {
  return (
    <div className="w-full p-2 md:p-4 flex justify-center items-center">
      <Line data={data} options={options} />
    </div>
  );
}
