"use server";
import prisma from "@/lib/prisma";

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
