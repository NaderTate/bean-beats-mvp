"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addAlbumsToShop = async (data: {
  albumsIds: string[];
  shopId: string;
}) => {
  const { albumsIds, shopId } = data;
  console.log({ data });
  const albums = await prisma.album.findMany({
    where: {
      id: {
        in: albumsIds,
      },
    },
  });
  const shop = await prisma.coffeeShop.findUnique({
    where: {
      id: shopId,
    },
  });
  if (!shop) {
    throw new Error("Shop not found");
  }
  await prisma.coffeeShop.update({
    where: {
      id: shopId,
    },
    data: {
      Albums: {
        connect: albums.map((album) => ({ id: album.id })),
      },
    },
  });
  return albums;
};

export const deleteAlbum = async (id: string) => {
  await prisma.album.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/music");
};
