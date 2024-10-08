"use client";

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ExportBtn from "@/components/export-btn";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type SalesData = {
  city: string | null;
  district: string | null;
  transactionCount: number | null;
  totalAmount: number | null;
};

type SalesByAreaProps = {
  salesData: SalesData[];
};

const SalesByArea: React.FC<SalesByAreaProps> = ({ salesData }) => {
  const t = useTranslations();

  const roundedSalesData = salesData.map((item) => ({
    ...item,
    transactionCount: item.transactionCount
      ? Number(item.transactionCount.toFixed(1))
      : null,
    totalAmount: item.totalAmount ? Number(item.totalAmount.toFixed(1)) : null,
  }));

  const data = {
    labels: roundedSalesData.map((item) => item.city),
    datasets: [
      {
        label: t("Number of Transactions"),
        data: roundedSalesData.map((item) => item.transactionCount),
        backgroundColor: "#8884d8",
        yAxisID: "y",
      },
      {
        label: t("Total Amount"),
        data: roundedSalesData.map((item) => item.totalAmount),
        backgroundColor: "#82ca9d",
        yAxisID: "y",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return Number(value).toFixed(1);
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label +=
                context.dataset.label === t("Total Amount")
                  ? `$${context.parsed.y.toFixed(1)}`
                  : context.parsed.y.toFixed(1);
            }
            return label;
          },
        },
      },
    },
  };

  // Prepare CSV data for export
  const csvData = useMemo(() => {
    return roundedSalesData.map((item) => ({
      City: item.city || "Unknown",
      District: item.district || "Unknown",
      "Number of Transactions": item.transactionCount?.toFixed(1) || "0.0",
      "Total Amount ($)": item.totalAmount?.toFixed(1) || "0.0",
    }));
  }, [roundedSalesData]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("Sales by Area")}</h2>
        <ExportBtn csvData={csvData} filename="sales_by_area.csv" />
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesByArea;
