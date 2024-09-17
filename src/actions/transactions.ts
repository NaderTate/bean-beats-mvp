"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    console.log({ shopId, songsIds, tableNumber });
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
        song: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            artist: { select: { name: true } },
          },
        },
      },
    });
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
        // store the name, album, and price of each song in the transaction
        songs: {
          set: songs.map((song) => ({
            id: song.id,
            title: song.song.title,
            artist: song.song.artist?.name,
            price: song.price,
            thumbnail: song.song.thumbnail,
          })),
        },
        tableNumber,
      },
    });

    const updateSongsTimesPurchased = songs.forEach(async (song) => {
      await prisma.song.update({
        where: {
          id: song.song.id,
        },
        data: {
          timesPurchased: {
            increment: 1,
          },
        },
      });
    });

    const addedSongsToQueue = await prisma.queueSong.createMany({
      data: songs.map((song) => ({
        songId: song.song.id,
        coffeeShopId: shopId,
        transactionId: transaction.id,
      })),
    });
    revalidatePath("/shop/[shopId]/queue");
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { success: false, message: "Failed to create transaction" };
  }
};
