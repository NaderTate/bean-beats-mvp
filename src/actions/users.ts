"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AdminPermission, UserRole } from "@prisma/client";

export const createUser = async (data: {
  name: string;
  email: string;
  image?: string;
  password: string;
  phoneNumber: string;
  permissions: AdminPermission[];
  role: UserRole;
}) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      revalidatePath("/coffee-shop/settings");
      return { error: "A User with this email already exists" };
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        image: data.image,
        password: hashedPassword,
        phoneNumber: data.phoneNumber,
        permissions: {
          set: data.permissions,
        },
        role: data.role,
      },
    });

    revalidatePath("/coffee-shop/settings");
    return { created: true, user };
  } catch (error) {
    revalidatePath("/coffee-shop/settings");
    console.error("Error creating dashboard employee:", error);
    return { error: "Unable to create dashboard employee at the moment." };
  }
};

export const updateUserData = async (data: {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  otherPhone?: string;
  image?: string | undefined;
  password?: string;
  website?: string;
  commercialRegistrationNumber?: string;
  permissions?: AdminPermission[];
}) => {
  console.log(data);
  const hashedPassword =
    data.password && (await bcrypt.hash(data.password, 10));
  const user = await prisma.user.update({
    where: { id: data.id },
    data: {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      image: data.image,
      otherPhone: data.otherPhone,
      website: data.website,
      commercialRegistrationNumber: data.commercialRegistrationNumber,
      password: data.password ? hashedPassword : undefined,
      permissions: data.permissions ? { set: data.permissions } : undefined,
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
