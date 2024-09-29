"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export const createShopWithAdmin = async (options: {
  shop: {
    name: string;
    logo: string | null;
  };
  admin: Prisma.Without<
    Prisma.UserCreateInput,
    Prisma.UserUncheckedCreateInput
  > &
    Prisma.UserUncheckedCreateInput;
}) => {
  try {
    const { shop, admin } = options;
    const hashedPassword =
      admin.password && (await bcrypt.hash(admin.password, 10));

    const shopAdmin = await prisma.user.create({
      data: {
        ...admin,
        password: hashedPassword,
      },
    });
    if (!shopAdmin) {
      revalidatePath("/dashboard/shops");
      return { created: false };
    }
    const shopAdminId = shopAdmin.id;

    const createShop = await prisma.coffeeShop.create({
      data: {
        ...shop,
        revenueShare: 0.1,
        workingHours: {
          sunday: { open: 0, close: 0 },
        },
        admin: {
          connect: {
            id: shopAdminId,
          },
        },
      },
    });

    if (!createShop) {
      revalidatePath("/dashboard/shops");
      return { created: false };
    }

    if (createShop && shopAdmin) {
      revalidatePath("/dashboard/shops");
      return { created: true };
    } else {
      revalidatePath("/dashboard/shops");
      return { created: false };
    }
  } catch (error: any) {
    console.error("Error creating shop and admin:", error);
    return { created: false, error: error.message };
  }
};

export const updateShop = async (options: {
  id: string;
  data: Prisma.CoffeeShopUpdateInput;
}) => {
  try {
    const { id, data } = options;
    const updatedShop = await prisma.coffeeShop.update({
      where: { id },
      data,
    });

    if (!updatedShop) {
      revalidatePath("/dashboard/shops");
      return { updated: false };
    }

    if (updatedShop) {
      revalidatePath("/dashboard/shops");
      return { updated: true };
    } else {
      revalidatePath("/dashboard/shops");
      return { updated: false };
    }
  } catch (error: any) {
    console.error("Error updating shop and admin:", error);
    return { updated: false, error: error.message };
  }
};
