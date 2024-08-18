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
  await prisma.playlist.delete({
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
  const playlists = await prisma.playlist.findMany({
    where: {
      id: {
        in: options.playlistsIds,
      },
    },
  });

  // create a duplicate of the playlists with the shopId
  const playlistsWithShopId = playlists.map((playlist) => ({
    ...playlist,
    shopId: options.shopId,
  }));

  // remove the id from the playlists
  const playlistsWithoutId = playlistsWithShopId.map(({ id, ...rest }) => rest);

  // create the playlists in the shop
  await prisma.playlist.createMany({
    data: playlistsWithoutId,
  });

  revalidatePath("/coffee-shop/music");
};
