"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getMultipleSongs = async (songIds: string[]) => {
  const songs = await prisma.song.findMany({
    where: {
      id: {
        in: songIds,
      },
    },
    include: {
      artist: { select: { name: true } },
    },
  });
  return songs;
};

export const addSongsToShop = async (data: {
  songIds: string[];
  shopId: string;
}) => {
  const songs = await prisma.song.findMany({
    where: {
      id: {
        in: data.songIds,
      },
    },
  });
  const shop = await prisma.coffeeShop.findUnique({
    where: {
      id: data.shopId,
    },
  });
  if (shop) {
    await prisma.coffeeShop.update({
      where: {
        id: data.shopId,
      },
      data: {
        songs: {
          connect: songs.map((song) => ({ id: song.id })),
        },
      },
    });
  }
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
