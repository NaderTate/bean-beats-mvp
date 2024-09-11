"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getUser } from "@/utils/get-user";
import { revalidatePath } from "next/cache";

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

export const deleteArtist = async (id: string) => {
  await prisma.artist.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/music");
};

export const updateArtist = async (options: {
  id: string;
  data: Prisma.Without<
    Prisma.ArtistUpdateInput,
    Prisma.ArtistUncheckedUpdateInput
  > &
    Prisma.ArtistUncheckedUpdateInput;
}) => {
  const { id, data } = options;
  await prisma.artist.update({
    where: {
      id,
    },
    data,
  });
  revalidatePath("/dashboard/music");
};

export const removeArtistFromShop = async (artistId: string) => {
  const user = await getUser();
  if (!user) {
    throw new Error("User not found");
  }
  const shop = await prisma.coffeeShop.findFirst({
    where: {
      adminId: user.id,
    },
  });
  if (!shop) {
    throw new Error("Shop not found");
  }

  await prisma.coffeeShop.update({
    where: {
      id: shop.id,
    },
    data: {
      Artists: {
        disconnect: { id: artistId },
      },
    },
  });
  revalidatePath("/dashboard/music");
};
