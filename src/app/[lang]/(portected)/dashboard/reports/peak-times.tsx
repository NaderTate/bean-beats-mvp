"use client";

import React, { useMemo, useState } from "react";
import ExportBtn from "@/components/export-btn";
import { useTranslations } from "next-intl";
import Select from "@/components/shared/Select";

type PeakTimeData = {
  hour: number;
  transactionCount: number;
  totalAmount: number;
  shopId: string;
  shopName: string;
};

type PeakTimesProps = {
  peakTimesData: PeakTimeData[];
};

const PeakTimes: React.FC<PeakTimesProps> = ({ peakTimesData }) => {
  const t = useTranslations();
  const [selectedShop, setSelectedShop] = useState<string>("all");

  const shopOptions = useMemo(() => {
    const uniqueShops = Array.from(
      new Set(peakTimesData.map((data) => data.shopId))
    );
    return [
      { value: "all", title: t("All Shops") },
      ...uniqueShops.map((shopId) => ({
        value: shopId,
        title:
          peakTimesData.find((data) => data.shopId === shopId)?.shopName || "",
      })),
    ];
  }, [peakTimesData, t]);

  const aggregatedData = useMemo(() => {
    const hourlyData: Record<number, PeakTimeData> = {};

    peakTimesData.forEach((data) => {
      if (selectedShop === "all" || data.shopId === selectedShop) {
        if (!hourlyData[data.hour]) {
          hourlyData[data.hour] = {
            ...data,
            transactionCount: 0,
            totalAmount: 0,
          };
        }
        hourlyData[data.hour].transactionCount += data.transactionCount;
        hourlyData[data.hour].totalAmount += data.totalAmount;
      }
    });

    return Object.values(hourlyData).sort((a, b) => a.hour - b.hour);
  }, [peakTimesData, selectedShop]);

  const maxCount = Math.max(
    ...aggregatedData.map((data) => data.transactionCount)
  );

  const csvData = useMemo(() => {
    return aggregatedData.map((data) => ({
      [t("Hour")]: `${data.hour}:00`,
      [t("Transaction Count")]: data.transactionCount,
      [t("Total Amount") + " ($)"]: data.totalAmount.toFixed(2),
      [t("Percentage of Peak")]:
        ((data.transactionCount / maxCount) * 100).toFixed(2) + "%",
    }));
  }, [aggregatedData, maxCount, t]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("Peak Times")}</h2>
        <div className="flex items-end gap-x-4">
          <Select
            width="fit"
            enableSearch
            value={selectedShop}
            options={shopOptions}
            label={t("Select Shop")}
            onChange={(e) => setSelectedShop(e.target.value)}
          />
          <ExportBtn csvData={csvData} filename="peak_times.csv" />
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {aggregatedData.map((data) => (
          <div key={data.hour} className="text-center">
            <div
              className="h-20 rounded"
              style={{
                backgroundColor: `rgba(66, 153, 225, ${
                  data.transactionCount / maxCount
                })`,
              }}
            ></div>
            <div className="mt-1">{data.hour}:00</div>
            <div className="text-sm text-gray-600">{data.transactionCount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeakTimes;
