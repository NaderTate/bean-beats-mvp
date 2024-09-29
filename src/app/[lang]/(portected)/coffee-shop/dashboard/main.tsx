"use client";

import React, { useState, useMemo } from "react";
import Analytics from "./analytics";
import { RiPlayList2Line } from "react-icons/ri";
import { FaMusic } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import LineChart from "@/components/shared/Charts/line-chart";
import SongCard from "./song-card";
import Table from "@/components/shared/table";
import { getCoffeeShop } from "@/utils/get-user";
import { Song } from "@prisma/client";
import Select from "@/components/shared/Select";
import { useTranslations } from "next-intl";

type CoffeeShopType = Awaited<ReturnType<typeof getCoffeeShop>>;

type Props = {
  transactions: {
    amount: number;
    createdAt: Date;
  }[];
  coffeeShop: CoffeeShopType["coffeeShop"];
  queueSongs: {
    song: {
      artist: {
        name: string;
        image: string;
      } | null;
    } & Song;
  }[];
};

const CoffeShopDashboardMain = ({
  transactions,
  coffeeShop,
  queueSongs,
}: Props) => {
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
        data.push(Math.round((dataMap.get(key) || 0) * 100) / 100); // Round to 2 decimal places
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
        data.push(Math.round((dataMap.get(key) || 0) * 100) / 100); // Round to 2 decimal places
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: data,
          fill: false,
          backgroundColor: "#3B82F6",
          borderColor: "#3B82F6",
          cubicInterpolationMode: "monotone",
        },
      ],
    };
  }, [filteredTransactions, timeRange]);

  return (
    <div className="p-5">
      <Analytics
        data={[
          {
            label: "Artists",
            value: coffeeShop?.artistsIds.length || 0,
            icon: FaCircleUser,
            iconColor: "text-gray-200",
          },
          {
            label: "Albums",
            value: coffeeShop?.albumsIds.length || 0,
            icon: RiPlayList2Line,
            iconColor: "text-red-300",
          },
          {
            label: "Songs",
            value: coffeeShop?._count.SongCoffeeShop || 0,
            icon: FaMusic,
            iconColor: "text-cyan-500",
          },
        ]}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{t("Revenue Over Time")}</h2>
        <Select
          value={timeRange}
          options={timeRangeOptions}
          label="Select Time Range"
          onChange={(e) => setTimeRange(e.target.value)}
        />
      </div>
      <LineChart data={chartData} />
      {queueSongs.length > 0 && (
        <>
          <SongCard song={queueSongs[0].song} />

          <Table
            hideSearch
            data={queueSongs.map(({ song }, i) => ({
              ...song,
              number: i + 1,
              artistName: song.artist?.name,
              artistImage: song.artist?.image,
            }))}
            fields={{
              number: "#",
              title: "Song Name",
              artistName: "Artist",
            }}
          />
        </>
      )}
    </div>
  );
};

export default CoffeShopDashboardMain;
