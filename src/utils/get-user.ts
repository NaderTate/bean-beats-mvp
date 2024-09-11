import prisma from "@/lib/prisma";

import { auth } from "@/utils/auth";
import { CoffeeShop } from "@prisma/client";

export const getUser = async () => {
  try {
    const session = await auth();
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCoffeeShop = async () => {
  const user = await getUser();
  let coffeeShop:
    | (CoffeeShop & {
        _count: {
          SongCoffeeShop: number;
        };
      })
    | null
    | undefined = null;
  if (user) {
    if (user.role === "EMPLOYEE") {
      const coffeeShopOnEmployee = await prisma.coffeeShopOnEmployee.findFirst({
        where: { id: user.id },
        select: { coffeeShop: { include: { _count: true } } },
      });

      coffeeShop = coffeeShopOnEmployee?.coffeeShop;
    } else if (user.role === "SHOP_ADMIN") {
      coffeeShop = await prisma.coffeeShop.findFirst({
        where: { adminId: user.id },
        include: { _count: { select: { SongCoffeeShop: true } } },
      });
    }
  }
  return coffeeShop;
};
