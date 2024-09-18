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
    console.log({ shopId, songsQuantities, tableNumber });

    // Get the list of song IDs
    const songsIds = Object.keys(songsQuantities);

    // Fetch song details from the database
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

    // Calculate the total amount considering quantities
    const amount = songs.reduce((acc, song) => {
      const quantity = songsQuantities[song.song.id] || 1;
      return acc + song.price * quantity;
    }, 0);

    // Prepare song data for the transaction, including quantities
    const transactionSongsData = songs.map((song) => {
      const quantity = songsQuantities[song.song.id] || 1;
      return {
        id: song.id,
        title: song.song.title,
        artist: song.song.artist?.name,
        price: song.price,
        thumbnail: song.song.thumbnail,
        quantity,
      };
    });

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
      const quantity = songsQuantities[song.song.id] || 1;
      await prisma.song.update({
        where: {
          id: song.song.id,
        },
        data: {
          timesPurchased: {
            increment: quantity,
          },
        },
      });
    }

    // Add songs to the queue based on their quantities
    const queueData = [];
    for (const song of songs) {
      const quantity = songsQuantities[song.song.id] || 1;
      for (let i = 0; i < quantity; i++) {
        queueData.push({
          songId: song.song.id,
          coffeeShopId: shopId,
          transactionId: transaction.id,
        });
      }
    }

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
