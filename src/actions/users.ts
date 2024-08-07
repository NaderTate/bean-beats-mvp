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
