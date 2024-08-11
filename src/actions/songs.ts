"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getMultipleSongs = async (options: {
  songsIds: string[];
  shopId: string;
}) => {
  const songs = await prisma.songCoffeeShop.findMany({
    where: {
      coffeeShopId: options.shopId,
      songId: {
        in: options.songsIds,
      },
    },
    select: {
      id: true,
      price: true,
      song: { include: { artist: true } },
    },
  });
  return songs;
};

export const addSongsToShop = async (data: {
  songsData: {
    songId: string;
    price: number;
  }[];
  shopId: string;
}) => {
  await prisma.songCoffeeShop.createMany({
    data: data.songsData.map((song, i) => ({
      songId: data.songsData[i].songId,
      coffeeShopId: data.shopId,
      price: data.songsData[i].price,
    })),
  });
};

export const deleteSong = async (id: string) => {
  await prisma.song.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/music");
};

export const updateSong = async (options: {
  id: string;
  data: Prisma.Without<
    Prisma.SongUpdateInput,
    Prisma.SongUncheckedUpdateInput
  > &
    Prisma.SongUncheckedUpdateInput;
}) => {
  const { id, data } = options;
  console.log({ data });
  await prisma.song.update({
    where: {
      id,
    },
    data,
  });
  revalidatePath("/dashboard/music");
};

export const deleteCoffeeShopSong = async (id: string) => {
  await prisma.songCoffeeShop.delete({
    where: {
      id,
    },
  });
  revalidatePath("/coffee-shop/music");
};
