"use server";
import prisma from "@/lib/prisma";

export const createTransaction = async ({
  shopId,
  songsIds,
  tableNumber,
}: {
  shopId: string;
  songsIds: string[];
  tableNumber: number;
}) => {
  try {
    const songs = await prisma.songCoffeeShop.findMany({
      where: {
        coffeeShopId: shopId,
        songId: {
          in: songsIds,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });
    console.log({ songsIds });
    const amount = songs.reduce((acc, song) => acc + song.price, 0);

    const transaction = await prisma.transaction.create({
      data: {
        status: "COMPLETED",
        amount,
        shop: {
          connect: {
            id: shopId,
          },
        },
        songs: {
          connect: songs.map((song) => ({ id: song.id })),
        },
        tableNumber,
      },
    });

    const addedSongsToQueue = await prisma.queueSong.createMany({
      data: songs.map((song) => ({
        songId: song.id,
        coffeeShopId: shopId,
        transactionId: transaction.id,
      })),
    });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { success: false, message: "Failed to create transaction" };
  }
};
