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
} from "chart.js";
import ExportBtn from "@/components/export-btn";

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
  const data = {
    labels: salesData.map((item) => item.city),
    datasets: [
      {
        label: "Number of Transactions",
        data: salesData.map((item) => item.transactionCount),
        backgroundColor: "#8884d8",
        yAxisID: "y",
      },
      {
        label: "Total Amount",
        data: salesData.map((item) => item.totalAmount),
        backgroundColor: "#82ca9d",
        yAxisID: "y",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.label === "Total Amount") {
              const roundedValue = Number(context.raw).toFixed(1);
              return `${context.dataset.label}: $${roundedValue}`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  // Prepare CSV data for export
  const csvData = useMemo(() => {
    return salesData.map((item) => ({
      City: item.city || "Unknown",
      District: item.district || "Unknown",
      "Number of Transactions": item.transactionCount || 0,
      "Total Amount ($)": item.totalAmount
        ? Number(item.totalAmount).toFixed(2)
        : "0.00",
    }));
  }, [salesData]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales by Area</h2>
        <ExportBtn csvData={csvData} filename="sales_by_area.csv" />
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesByArea;
