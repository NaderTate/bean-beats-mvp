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

  if (!user) {
    redirect("/signin");
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
