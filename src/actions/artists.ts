"use server";

import prisma from "@/lib/prisma";

export const addArtistsToShop = async (data: {
  artistIds: string[];
  shopId: string;
}) => {
  const artists = await prisma.artist.findMany({
    where: {
      id: {
        in: data.artistIds,
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
        Artists: {
          connect: artists.map((artist) => ({ id: artist.id })),
        },
      },
    });
  }
};
