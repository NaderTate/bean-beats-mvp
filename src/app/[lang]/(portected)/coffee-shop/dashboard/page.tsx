import { getCoffeeShop, getUser } from "@/utils/get-user";
import { NextPage } from "next";
import prisma from "@/lib/prisma";
import Analytics from "./analytics";
import { IoIosPerson } from "react-icons/io";
import { RiPlayList2Line } from "react-icons/ri";
import { FaMusic } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import LineChart from "@/components/shared/Charts/line-chart";
import SongCard from "./song-card";
import Table from "@/components/shared/table";
import { CoffeeShop } from "@prisma/client";

const data = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "",
      data: [0, 3, 8, 8, 12, 13, 25, 30, 35, 40, 45, 50],
      fill: false,
      backgroundColor: "#10B981",
      borderColor: "#10B981",
      cubicInterpolationMode: "monotone",
    },
  ],
};

type DashboardPageProps = {};

const DashboardPage: NextPage = async ({}: DashboardPageProps) => {
  const coffeeShop = await getCoffeeShop();
  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
      shopId: coffeeShop?.id,
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });
  const songsQueue = await prisma.queueSong.findMany({
    where: { coffeeShopId: coffeeShop?.id },
    include: {
      song: { include: { artist: { select: { name: true, image: true } } } },
    },
    orderBy: { id: "asc" },
  });

  const currentYear = new Date().getFullYear();
  const monthlyRevenue = new Array(12).fill(0);

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    if (date.getFullYear() === currentYear) {
      const month = date.getMonth();
      // Convert amount to cents
      const amountInCents = Math.round(transaction.amount * 100);
      monthlyRevenue[month] += amountInCents;
    }
  });

  // Convert back to dollars with two decimal places
  for (let i = 0; i < monthlyRevenue.length; i++) {
    monthlyRevenue[i] = monthlyRevenue[i] / 100;
  }

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
      <LineChart
        data={{
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [
            {
              label: "Revenue",
              data: monthlyRevenue,
              fill: false,
              backgroundColor: "#3B82F6",
              borderColor: "#3B82F6",
              cubicInterpolationMode: "monotone",
            },
          ],
        }}
      />
      {songsQueue.length > 0 && (
        <>
          <SongCard song={songsQueue[0].song} />

          <Table
            hideSearch
            data={songsQueue.map(({ song }, i) => ({
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

export default DashboardPage;
