"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createPlaylist = async (options: {
  data: Prisma.Without<
    Prisma.PlaylistCreateInput,
    Prisma.PlaylistUncheckedCreateInput
  > &
    Prisma.PlaylistUncheckedCreateInput;
}) => {
  await prisma.playlist.create({
    data: options.data,
  });
  revalidatePath("/dashboard/music");
};

export const updatePlaylist = async (options: {
  id: string;
  data: Prisma.Without<
    Prisma.PlaylistUpdateInput,
    Prisma.PlaylistUncheckedUpdateInput
  > &
    Prisma.PlaylistUncheckedUpdateInput;
}) => {
  const { id, data } = options;
  const removePlaylistSongs = prisma.playlist.update({
    where: {
      id,
    },
    data: {
      songs: {
        set: [],
      },
    },
  });
  const updatePlaylist = prisma.playlist.update({
    where: {
      id,
    },
    data,
  });
  await prisma.$transaction([removePlaylistSongs, updatePlaylist]);
  revalidatePath("/dashboard/music");
};

export const deletePlaylist = async (id: string) => {
  const playlist = await prisma.playlist.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/music");
};

export const addPlaylistsToShop = async (options: {
  playlistsIds: string[];
  shopId: string;
}) => {
  await prisma.coffeeShop.update({
    where: {
      id: options.shopId,
    },
    data: {
      Playlist: {
        connect: options.playlistsIds.map((id) => ({ id })),
      },
    },
  });
};
