"use client";
import React from "react";
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
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// daily sales

export default function LineChart({ data }: any) {
  const t = useTranslations();

  return (
    <div className="w-full p-2 md:p-4 flex justify-center items-center">
      <Line
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: t("Monthly stats"),
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
        }}
      />
    </div>
  );
}
