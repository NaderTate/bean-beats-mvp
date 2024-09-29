import { getCoffeeShop } from "@/utils/get-user";
import { NextPage } from "next";
import prisma from "@/lib/prisma";
import CoffeShopDashboardMain from "./main";

type DashboardPageProps = {};

const DashboardPage: NextPage = async ({}: DashboardPageProps) => {
  const { coffeeShop } = await getCoffeeShop();

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



  return (
    <CoffeShopDashboardMain
      queueSongs={songsQueue}
      coffeeShop={coffeeShop}
      transactions={transactions}
    />
  );
};

export default DashboardPage;
