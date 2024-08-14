"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createGenre = async (options: {
  data: Prisma.Without<
    Prisma.GenreCreateInput,
    Prisma.GenreUncheckedCreateInput
  > &
    Prisma.GenreUncheckedCreateInput;
}) => {
  try {
    await prisma.genre.create({
      data: options.data,
    });
  } catch (error) {
    console.error(error);
  }
  revalidatePath("/dashboard/music");
};

export const updateGenre = async (options: {
  id: string;
  data: Prisma.Without<
    Prisma.GenreUpdateInput,
    Prisma.GenreUncheckedUpdateInput
  > &
    Prisma.GenreUncheckedUpdateInput;
}) => {
  const { id, data } = options;
  await prisma.genre.update({
    where: {
      id,
    },
    data,
  });
  revalidatePath("/dashboard/music");
};

export const deleteGenre = async (id: string) => {
  const genre = await prisma.genre.delete({
    where: {
      id,
    },
  });
  revalidatePath("/dashboard/music");
};
