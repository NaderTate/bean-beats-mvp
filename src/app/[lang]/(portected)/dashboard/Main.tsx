"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useGetLang from "@/hooks/use-get-lang";
import SongsList from "@/components/shared/List/songs";
import NCard from "@/components/shared/Cards/numeric-card";
import LineChart from "@/components/shared/Charts/line-chart";
import { FaShop, FaMoneyBillWave, FaMusic } from "react-icons/fa6";
import Select from "@/components/shared/Select";

interface MainProps {
  topSongs: {
    artist: {
      name: string;
    } | null;
    title: string;
    thumbnail: string;
  }[];
  transactions: {
    amount: number;
    createdAt: Date;
  }[];
  allSongs: number;
  allCoffeeShops: number;
}

const Main = ({
  topSongs,
  transactions,
  allSongs,
  allCoffeeShops,
}: MainProps) => {
  const t = useTranslations();
  const { lang } = useGetLang();
  const { push } = useRouter();
  const [timeRange, setTimeRange] = useState("last7days");

  const timeRangeOptions = [
    { value: "last7days", title: t("Last 7 Days") },
    { value: "last30days", title: t("Last 30 Days") },
    { value: "last3months", title: t("Last 3 Months") },
    { value: "last6months", title: t("Last 6 Months") },
    { value: "lastYear", title: t("Last Year") },
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
        filterDate.setDate(now.getDate() - 30);
    }

    return transactions.filter(
      (transaction) => new Date(transaction.createdAt) >= filterDate
    );
  }, [transactions, timeRange]);

  const chartData = useMemo(() => {
    const dataMap = new Map();
    const now = new Date();

    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      let key;

      if (timeRange === "last7days" || timeRange === "last30days") {
        key = date.toISOString().split("T")[0]; // Use YYYY-MM-DD as key
      } else {
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`; // Use YYYY-MM as key
      }

      dataMap.set(key, (dataMap.get(key) || 0) + transaction.amount);
    });

    let labels = [];
    let data = [];

    if (timeRange === "last7days" || timeRange === "last30days") {
      const days = timeRange === "last7days" ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        labels.push(
          date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );
        data.push(Math.round((dataMap.get(key) || 0) * 10) / 10); // Round to 1 decimal place
      }
    } else {
      // For longer time ranges, aggregate by month
      const months =
        timeRange === "last3months" ? 3 : timeRange === "last6months" ? 6 : 12;
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        labels.push(
          date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
        );
        data.push(Math.round((dataMap.get(key) || 0) * 10) / 10); // Round to 1 decimal place
      }
    }

    return {
      labels,
      datasets: [
        {
          label: t("Revenue"),
          data: data,
          fill: false,
          backgroundColor: "#3B82F6",
          borderColor: "#3B82F6",
          cubicInterpolationMode: "monotone",
        },
      ],
    };
  }, [filteredTransactions, timeRange, t]);

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const list = [
    {
      Icon: () => <FaMoneyBillWave className="text-4xl text-green-500" />,
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      percent: "67.81%",
      href: "/dashboard/transactions",
    },
    {
      Icon: () => <FaShop className="text-4xl text-blue-500" />,
      title: "Coffee Shops",
      value: allCoffeeShops,
      href: "/dashboard/shops",
    },
    {
      Icon: () => <FaMusic className="text-4xl text-yellow-500" />,
      title: "Songs",
      value: allSongs,
      href: "/dashboard/music?secion=Songs",
    },
  ];

  return (
    <main className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <section className="grid col-span-1 gap-4 lg:grid-cols-3">
        {list.map((item) => (
          <NCard
            key={item.title + "section1"}
            item={item}
            cb={() => push(`/${lang}${item.href}`)}
          />
        ))}
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-8 pt-10">
        <div className="col-span-1 md:col-span-2 lg:col-span-5 border border-gray-200 rounded-xl shadow-md bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">{t("Revenue Over Time")}</h2>
            <Select
              value={timeRange}
              options={timeRangeOptions}
              label={t("Select Time Range")}
              onChange={(e) => setTimeRange(e.target.value)}
            />
          </div>
          <LineChart data={chartData} />
        </div>
        <SongsList topSongs={topSongs} />
      </section>
    </main>
  );
};

export default Main;
