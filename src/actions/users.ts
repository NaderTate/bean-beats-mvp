"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateUserData = async (data: {
  name: string;
  email: string;
  phoneNumber: string;
}) => {
  console.log({ data });
  const user = await prisma.user.update({
    where: { email: data.email },
    data: {
      name: data.name,
      phoneNumber: data.phoneNumber,
    },
  });
  revalidatePath("/coffee-shop/settings");
  return user;
};

export const updateUserPassword = async (data: {
  userId: string;
  password: string;
}) => {
  const user = await prisma.user.update({
    where: { id: data.userId },
    data: {
      password: data.password,
    },
  });
  revalidatePath("/coffee-shop/settings");
  return user;
};
