"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateUserData = async (data: {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string | undefined;
  password?: string;
}) => {
  const hashedPassword =
    data.password && (await bcrypt.hash(data.password, 10));
  const user = await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      image: data.image || undefined,
      password: data.password ? hashedPassword : undefined,
    },
  });
  revalidatePath("/coffee-shop/settings");
  return user;
};

export const updateUserPassword = async (data: {
  userId: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.update({
    where: { id: data.userId },
    data: {
      password: hashedPassword,
    },
  });
  revalidatePath("/coffee-shop/settings");
  return user;
};

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/coffee-shop/settings");
};
