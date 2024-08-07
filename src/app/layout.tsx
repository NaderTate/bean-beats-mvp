import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

import SessionProvider from "@/components/auth/Provider";

import prisma from "@/lib/prisma";
import { getUser } from "@/utils/get-user";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bean Beats",
  description: "Enjoy your coffee with a side of music",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionUser = await getUser();

  const user = sessionUser
    ? await prisma.user.findUnique({
        where: { id: sessionUser?.id },
        select: { role: true },
      })
    : null;

  const coffeeShops = sessionUser
    ? await prisma.coffeeShop.findMany({
        where: { adminId: sessionUser?.id },
      })
    : [];

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider
          userRole={user?.role}
          sessionUser={sessionUser}
          coffeeShops={coffeeShops}
        >
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
