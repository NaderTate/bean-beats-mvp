import { getUser } from "@/utils/get-user";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
export default async function Home() {
  const sessionUser = await getUser();
  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser?.id },
        select: { role: true },
      })
    : null;
  if (user?.role === "PLATFORM_ADMIN") {
    redirect("/dashboard");
  }
  if (user?.role === "SHOP_ADMIN") {
    const userShops = await prisma.coffeeShop.findMany({
      where: { adminId: sessionUser?.id },
    });
    if (!userShops || userShops.length === 0) {
      const shop = await prisma.coffeeShop.create({
        data: {
          name: `${sessionUser?.name}'s Shop`,
          adminId: sessionUser?.id as string,
          address: "My Address",
          revenueShare: 0.1,
          workingHours: {
            sunday: { open: 0, close: 0 },
          },
        },
      });
    }
    redirect("/coffee-shop/dashboard");
  }
  return <main></main>;
}
