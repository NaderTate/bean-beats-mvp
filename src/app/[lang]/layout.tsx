import "@/app/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

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
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const sessionUser = await getUser();
  const messages = await getMessages();

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
  console.log({ lang });
  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
      <body className={inter.className}>
        <SessionProvider
          userRole={user?.role}
          sessionUser={sessionUser}
          coffeeShops={coffeeShops}
        >
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
