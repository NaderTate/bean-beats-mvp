"use server";

import prisma from "@/lib/prisma";
import { AdminPermission, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export const createShopEmployee = async (data: {
  shopId: string;
  employee: Prisma.Without<
    Prisma.UserCreateInput,
    Prisma.UserUncheckedCreateInput
  > &
    Prisma.UserUncheckedCreateInput;
}) => {
  const { shopId, employee } = data;

  try {
    const hashedPassword =
      employee.password && (await bcrypt.hash(employee.password, 10));

    const existingUser = await prisma.user.findUnique({
      where: { email: employee.email },
    });
    if (existingUser) {
      revalidatePath("/coffee-shop/employees");
      return { error: "A User with this email already exists" };
    }
    const createEmployee = await prisma.coffeeShopOnEmployee.create({
      data: {
        user: {
          create: {
            ...employee,
            role: "EMPLOYEE",
            password: hashedPassword,
          },
        },
        coffeeShop: { connect: { id: shopId } },
      },
    });

    revalidatePath("/coffee-shop/employees");
    return { created: true, createEmployee }; // Return the result if necessary
  } catch (error) {
    revalidatePath("/coffee-shop/employees");
    console.error("Error creating employee:", error);
    // Optionally, you can throw a custom error if needed
    return { error: "Unable to create employee at the moment." };
  }
};

export const removeEmployeeFromShop = async (employeeId: string) => {
  try {
    const coffeeShopOnEmployee = await prisma.coffeeShopOnEmployee.findFirst({
      where: { userId: employeeId },
    });
    if (coffeeShopOnEmployee) {
      await prisma.coffeeShopOnEmployee.delete({
        where: { id: coffeeShopOnEmployee.id },
      });
    }
    revalidatePath("/coffee-shop/employees");
  } catch (error) {
    revalidatePath("/coffee-shop/employees");

    console.error("Error removing employee from shop:", error);

    // Optionally, you can throw a custom error if needed
    throw new Error("Unable to remove employee from shop at the moment.");
  }
};
