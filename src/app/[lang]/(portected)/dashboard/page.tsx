import prisma from "@/lib/prisma";

import Main from "./Main";

const Page = async () => {
  const allSongs = await prisma.song.count();
  const allCoffeeShops = await prisma.coffeeShop.count();

  const transactions = await prisma.transaction.findMany({
    where: {
      status: "COMPLETED",
    },
    select: {
      amount: true,
      createdAt: true,
    },
  });

  const topSongs = await prisma.song.findMany({
    take: 5,
    orderBy: {
      timesPurchased: "desc",
    },
    select: {
      thumbnail: true,
      title: true,
      artist: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <Main
      topSongs={topSongs}
      allSongs={allSongs}
      transactions={transactions}
      allCoffeeShops={allCoffeeShops}
    />
  );
};

export default Page;
