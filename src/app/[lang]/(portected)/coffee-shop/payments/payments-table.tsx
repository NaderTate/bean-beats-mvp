"use client";

import { useTranslations } from "next-intl";
import React, { useState, useMemo } from "react";

import Table from "@/components/shared/table";
import Select from "@/components/shared/Select";
import PrintReceipt from "./print-receipt";

type Props = {
  transactions: {
    id: string;
    amount: number;
    tableNumber: number;
    createdAt: Date;
    shop?: {
      name?: string;
      logo?: string | null;
      country?: string | null;
      city?: string | null;
      songPrice?: number;
      phone?: string | null;
    };
    _count: {
      QueueSong: number;
    };
  }[];
  viewLink?: string;
  viewShopFilter?: boolean;
};

const PaymentsTable = ({
  transactions,
  viewLink,
  viewShopFilter = false,
}: Props) => {
  const t = useTranslations();
  const [timeRange, setTimeRange] = useState<timeInterval>("last7days");
  const [selectedShop, setSelectedShop] = useState<string>("all");

  const timeRangeOptions: { value: timeInterval; title: string }[] = [
    { value: "last7days", title: "Last 7 Days" },
    { value: "last30days", title: "Last 30 Days" },
    { value: "last3months", title: "Last 3 Months" },
    { value: "last6months", title: "Last 6 Months" },
    { value: "lastYear", title: "Last Year" },
  ];

  const shopOptions = useMemo(() => {
    const uniqueShops = Array.from(
      new Set(transactions.map((t) => t?.shop?.name))
    );
    return [
      { value: "all", title: "All Shops" },
      ...uniqueShops.map((shop) => ({ value: shop || "", title: shop || "" })),
    ];
  }, [transactions]);

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
      (transaction) =>
        new Date(transaction.createdAt) >= filterDate &&
        (selectedShop === "all" || transaction?.shop?.name === selectedShop)
    );
  }, [transactions, timeRange, selectedShop]);

  const receiptData = useMemo(() => {
    if (selectedShop === "all") return null;

    const shopTransactions = filteredTransactions.filter(
      (t) => t.shop?.name === selectedShop
    );
    const totalSongsSold = shopTransactions.reduce(
      (sum, t) => sum + t._count.QueueSong,
      0
    );
    const totalRevenue = shopTransactions.reduce((sum, t) => sum + t.amount, 0);
    const shopInfo = shopTransactions[0]?.shop;

    return {
      shopName: selectedShop,
      shopLogo: shopInfo?.logo || "",
      timeInterval: timeRangeOptions.find((t) => t.value === timeRange)?.title,
      shopCountry: shopInfo?.country,
      shopCity: shopInfo?.city,
      phoneNumber: shopInfo?.phone,
      totalSongsSold,
      totalRevenue,
      songPrice: shopInfo?.songPrice,
      receiptId: Math.floor(Math.random() * 1000000),
    };
  }, [filteredTransactions, selectedShop, timeRange]);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-4"></div>
      <Table
        filters={[
          <>
            <Select
              width="fit"
              value={timeRange}
              options={timeRangeOptions}
              label={t("Select Time Range")}
              onChange={(e) => setTimeRange(e.target.value as timeInterval)}
            />
            {viewShopFilter && (
              <Select
                width="fit"
                enableSearch
                value={selectedShop}
                options={shopOptions}
                label={t("Select Shop")}
                onChange={(e) => setSelectedShop(e.target.value)}
              />
            )}
            {receiptData && viewShopFilter && (
              <PrintReceipt data={receiptData} />
            )}
          </>,
        ]}
        viewLink={viewLink}
        data={filteredTransactions.map((transaction) => ({
          ...transaction,
          shop: transaction.shop?.name,
          Songs: transaction._count.QueueSong,
          Date: new Date(transaction.createdAt).toLocaleDateString(),
        }))}
        fields={{
          shop: "Shop",
          tableNumber: "Table No",
          Date: "Date",
          amount: "Total Cost",
        }}
      />
    </div>
  );
};

export default PaymentsTable;
