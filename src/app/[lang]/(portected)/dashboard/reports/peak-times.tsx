"use client";

import React, { useMemo } from "react";
import ExportBtn from "@/components/export-btn";

type PeakTimeData = {
  hour: number;
  transactionCount: number;
  totalAmount: number;
};

type PeakTimesProps = {
  peakTimesData: PeakTimeData[];
};

const PeakTimes: React.FC<PeakTimesProps> = ({ peakTimesData }) => {
  const maxCount = Math.max(
    ...peakTimesData.map((data) => data.transactionCount)
  );

  // Prepare CSV data for export
  const csvData = useMemo(() => {
    return peakTimesData.map((data) => ({
      Hour: `${data.hour}:00`,
      "Transaction Count": data.transactionCount,
      "Total Amount ($)": data.totalAmount.toFixed(2),
      "Percentage of Peak":
        ((data.transactionCount / maxCount) * 100).toFixed(2) + "%",
    }));
  }, [peakTimesData, maxCount]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Peak Times</h2>
        <ExportBtn csvData={csvData} filename="peak_times.csv" />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {peakTimesData.map((data) => (
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
