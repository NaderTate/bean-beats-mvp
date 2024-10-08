"use client";

import React, { useState, useMemo } from "react";
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
import Select from "@/components/shared/Select";
import ExportBtn from "@/components/export-btn";
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

type SalesData = {
  date: string;
  count: number;
  totalAmount: number;
  shopId: string;
  shopName: string;
};

type SongSalesTrendProps = {
  salesData: SalesData[];
};

const SongSalesTrend: React.FC<SongSalesTrendProps> = ({ salesData }) => {
  const t = useTranslations();
  const [timeRange, setTimeRange] = useState("last3months");
  const [selectedShop, setSelectedShop] = useState("all");

  const timeRangeOptions = [
    { value: "last7days", title: t("Last 7 Days") },
    { value: "last30days", title: t("Last 30 Days") },
    { value: "last3months", title: t("Last 3 Months") },
    { value: "last6months", title: t("Last 6 Months") },
    { value: "lastYear", title: t("Last Year") },
  ];

  const shopOptions = useMemo(() => {
    const uniqueShops = Array.from(
      new Set(salesData.map((data) => data.shopId))
    );
    return [
      { value: "all", title: t("All Shops") },
      ...uniqueShops.map((shopId) => ({
        value: shopId,
        title: salesData.find((data) => data.shopId === shopId)?.shopName || "",
      })),
    ];
  }, [salesData, t]);

  const generateDateRange = (start: Date, end: Date, isMonthly: boolean) => {
    const dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      if (isMonthly) {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return dates;
  };

  const { dateRange, filteredAndAggregatedSalesData, isMonthly } =
    useMemo(() => {
      const now = new Date();
      const startDate = new Date();
      let isMonthly = false;

      switch (timeRange) {
        case "last7days":
          startDate.setDate(now.getDate() - 7);
          break;
        case "last30days":
          startDate.setDate(now.getDate() - 30);
          break;
        case "last3months":
          startDate.setMonth(now.getMonth() - 3);
          isMonthly = true;
          break;
        case "last6months":
          startDate.setMonth(now.getMonth() - 6);
          isMonthly = true;
          break;
        case "lastYear":
          startDate.setFullYear(now.getFullYear() - 1);
          isMonthly = true;
          break;
        default:
          startDate.setMonth(now.getMonth() - 3);
          isMonthly = true;
      }

      const dateRange = generateDateRange(startDate, now, isMonthly);

      const filteredSalesData =
        selectedShop === "all"
          ? salesData
          : salesData.filter((data) => data.shopId === selectedShop);

      const aggregatedData = filteredSalesData.reduce((acc, curr) => {
        const date = new Date(curr.date);
        const key = isMonthly
          ? `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`
          : date.toISOString().split("T")[0];

        if (!acc[key]) {
          acc[key] = { count: 0, totalAmount: 0 };
        }
        acc[key].count += curr.count;
        acc[key].totalAmount += curr.totalAmount;
        return acc;
      }, {} as Record<string, { count: number; totalAmount: number }>);

      const filteredAndAggregatedSalesData = dateRange.map((date) => {
        const key = isMonthly
          ? `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, "0")}`
          : date.toISOString().split("T")[0];
        return {
          date: key,
          count: aggregatedData[key]?.count || 0,
          totalAmount: aggregatedData[key]?.totalAmount || 0,
        };
      });

      return { dateRange, filteredAndAggregatedSalesData, isMonthly };
    }, [salesData, timeRange, selectedShop]);

  const formatDate = (date: Date) => {
    if (isMonthly) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: timeRange === "lastYear" ? "numeric" : undefined,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const data = {
    labels: dateRange.map(formatDate),
    datasets: [
      {
        label: t("Number of Songs Sold"),
        data: filteredAndAggregatedSalesData.map((item) => item.count),
        borderColor: "#8884d8",
        backgroundColor: "rgba(136, 132, 216, 0.5)",
        yAxisID: "y1",
        tension: 0.4,
      },
      {
        label: t("Total Revenue"),
        data: filteredAndAggregatedSalesData.map((item) => item.totalAmount),
        borderColor: "#82ca9d",
        backgroundColor: "rgba(130, 202, 157, 0.5)",
        yAxisID: "y2",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 20,
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        beginAtZero: true,
        title: {
          display: true,
          text: t("Number of Songs Sold"),
        },
      },
      y2: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: t("Total Revenue") + " ($)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.label === t("Total Revenue")) {
              return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
            }
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
      legend: {
        position: "top" as const,
      },
    },
  };

  // Prepare CSV data with translations
  const csvData = useMemo(() => {
    return filteredAndAggregatedSalesData.map((item) => ({
      [t("Date")]: item.date,
      [t("Number of Songs Sold")]: item.count,
      [t("Total Revenue")]: item.totalAmount.toFixed(2),
    }));
  }, [filteredAndAggregatedSalesData, t]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-xl font-semibold">{t("Song Sales Trend")}</h2>
          <div className="flex items-end gap-x-4">
            <Select
              width="fit"
              value={timeRange}
              options={timeRangeOptions}
              label={t("Select Time Range")}
              onChange={(e) => setTimeRange(e.target.value)}
            />
            <Select
              width="fit"
              enableSearch
              value={selectedShop}
              options={shopOptions}
              label={t("Select Shop")}
              onChange={(e) => setSelectedShop(e.target.value)}
            />
            <ExportBtn
              csvData={csvData}
              filename={`song_sales_trend_${
                // shop name
                selectedShop === "all"
                  ? "all"
                  : shopOptions.find((shop) => shop.value === selectedShop)
                      ?.title
              }_${timeRange}.csv`}
            />
          </div>
        </div>
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default SongSalesTrend;
