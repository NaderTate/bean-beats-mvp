import prisma from "@/lib/prisma";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

import { getUser } from "@/utils/get-user";
import { redirect } from "next/navigation";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getUser();
  const coffeeShops = user
    ? await prisma.coffeeShop.findMany({
        where: { adminId: user?.id },
      })
    : [];
  if (!user) {
    redirect("/signin");
  }
  if (!coffeeShops || coffeeShops.length === 0) {
    return <div>You don&apos;t have any coffee shops</div>;
  }

  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="pl-5 mt-20 w-full">{children}</div>
    </div>
  );
};

export default Layout;
