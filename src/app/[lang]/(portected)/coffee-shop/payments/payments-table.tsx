"use client";

import React, { useState, useMemo } from "react";
import Table from "@/components/shared/table";
import Select from "@/components/shared/Select";
import { useTranslations } from "next-intl";

type Props = {
  transactions: {
    id: string;
    _count: {
      QueueSong: number;
    };
    createdAt: Date;
    amount: number;
    tableNumber: number;
  }[];
  viewLink?: string;
};

const PaymentsTable = ({ transactions, viewLink }: Props) => {
  const t = useTranslations();
  const [timeRange, setTimeRange] = useState("last7days");

  const timeRangeOptions = [
    { value: "last7days", title: "Last 7 Days" },
    { value: "last30days", title: "Last 30 Days" },
    { value: "last3months", title: "Last 3 Months" },
    { value: "last6months", title: "Last 6 Months" },
    { value: "lastYear", title: "Last Year" },
  ];

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case "last7days":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "last30days":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "last3months":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "last6months":
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case "lastYear":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setFullYear(now.getFullYear() - 1);
    }

    return transactions.filter(
      (transaction) => new Date(transaction.createdAt) >= filterDate
    );
  }, [transactions, timeRange]);

  return (
    <div className="w-full">
      <Table
        filters={[
          <Select
            key={1}
            value={timeRange}
            options={timeRangeOptions}
            label={t("Select Time Range")}
            onChange={(e) => setTimeRange(e.target.value)}
          />,
        ]}
        viewLink={viewLink}
        data={filteredTransactions.map((transaction) => ({
          ...transaction,
          Songs: transaction._count.QueueSong,
          Date: new Date(transaction.createdAt).toLocaleDateString(),
        }))}
        fields={{
          tableNumber: "Table No",
          Date: "Date",
          amount: "Total Cost",
        }}
      />
    </div>
  );
};

export default PaymentsTable;
