import { redirect } from "next/navigation";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

import { getUser } from "@/utils/get-user";

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
      <div className="mt-20 w-full px-5">{children}</div>
    </div>
  );
};

export default Layout;
