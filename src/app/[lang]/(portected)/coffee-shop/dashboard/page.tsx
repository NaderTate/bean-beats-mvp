import { getUser } from "@/utils/get-user";
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
  const user = await getUser();
  const coffeeShop = user
    ? await prisma.coffeeShop.findFirst({
        where: { adminId: user?.id },
        include: { _count: { select: { SongCoffeeShop: true } } },
      })
    : null;

  const songsQueue = await prisma.queueSong.findMany({
    where: { coffeeShopId: coffeeShop?.id },
    include: {
      song: { include: { artist: { select: { name: true, image: true } } } },
    },
    orderBy: { id: "asc" },
  });
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
      <LineChart data={data} />
      {songsQueue.length > 0 && (
        <>
          <h1 className="text-2xl font-semibold mt-5">Current playing song</h1>
          <SongCard song={songsQueue[0].song} />
          <h1 className="text-2xl font-semibold -mb-10 mt-10">Music Queue</h1>
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
