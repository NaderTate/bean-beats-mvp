import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

import CreatePassword from "./(public)/create-password";
import NotVerified from "./(public)/not-verified-warning";

import { getUser } from "@/utils/get-user";

interface HomePageProps {
  params: { lang: string };
}
export default async function Home({ params: { lang } }: HomePageProps) {
  const sessionUser = await getUser();

  if (!sessionUser) {
    redirect(`/${lang}/signin`);
  }

  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser?.id },
        select: {
          role: true,
          password: true,
          id: true,
          permissions: true,
          isVerified: true,
        },
      })
    : null;

  if (user && !user.password) {
    return <CreatePassword userId={user.id} />;
  }

  if (user && user.role === "SHOP_ADMIN" && user.isVerified === false) {
    return <NotVerified />;
  }

  if (user?.role === "PLATFORM_ADMIN") {
    if (user.permissions.includes("ALL")) {
      redirect(`/${lang}/dashboard`);
    }
    if (user.permissions.includes("UPLOAD_MUSIC")) {
      redirect(`/${lang}/dashboard/music`);
    }
    if (user.permissions.includes("VIEW_TRANSACTIONS")) {
      redirect(`/${lang}/dashboard/transactions`);
    }
  }

  if (user?.role === "EMPLOYEE") {
    redirect(`/${lang}/coffee-shop/dashboard`);
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
          revenueShare: 0.1,
          workingHours: {
            sunday: { open: 0, close: 0 },
          },
        },
      });
    }

    redirect(`/${lang}/coffee-shop/dashboard`);
  }

  return <></>;
}
