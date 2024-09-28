"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createTransaction = async ({
  shopId,
  songsQuantities,
  tableNumber,
}: {
  shopId: string;
  songsQuantities: { [songId: string]: number };
  tableNumber: number;
}) => {
  try {
    const coffeeShop = await prisma.coffeeShop.findUnique({
      where: { id: shopId },
      select: {
        songPrice: true,
      },
    });

    if (!coffeeShop) {
      throw new Error("Coffee shop not found");
    }

    const songPrice = coffeeShop.songPrice;

    // Get the list of song IDs
    const songsIds = Object.keys(songsQuantities);

    // Fetch song details from the database
    const songs = await prisma.song.findMany({
      where: {
        id: {
          in: songsIds,
        },
      },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        artist: { select: { name: true } },
      },
    });

    // Calculate the total amount considering quantities
    const amount = Object.values(songsQuantities).reduce(
      (acc, quantity) => acc + songPrice * quantity,
      0
    );

    // Prepare song data for the transaction, including quantities
    const transactionSongsData = songs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist?.name,
      price: songPrice,
      thumbnail: song.thumbnail,
      quantity: songsQuantities[song.id] || 1,
    }));

    // Create the transaction with songs and their quantities
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
          set: transactionSongsData,
        },
        tableNumber,
      },
    });

    // Update timesPurchased for each song based on quantity
    for (const song of songs) {
      const quantity = songsQuantities[song.id] || 1;
      await prisma.song.update({
        where: {
          id: song.id,
        },
        data: {
          timesPurchased: {
            increment: quantity,
          },
        },
      });
    }

    // Add songs to the queue based on their quantities
    const queueData = songs.flatMap((song) =>
      Array(songsQuantities[song.id] || 1).fill({
        songId: song.id,
        coffeeShopId: shopId,
        transactionId: transaction.id,
      })
    );

    // Bulk create queue entries
    await prisma.queueSong.createMany({
      data: queueData,
    });

    // Revalidate the cache for the queue page
    revalidatePath(`/shop/${shopId}/queue`);

    return { success: true, message: "Transaction created successfully" };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return { success: false, message: "Failed to create transaction" };
  }
};
