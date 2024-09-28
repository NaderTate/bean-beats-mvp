import { redirect } from "next/navigation";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

import { getCoffeeShop } from "@/utils/get-user";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { coffeeShop } = await getCoffeeShop();

  if (!coffeeShop) {
    redirect("/signin");
  }

  return (
    <div className="flex">
      <Navbar shopId={coffeeShop.id} />
      <Sidebar />
      <div className="mt-20 w-full px-5">{children}</div>
    </div>
  );
};

export default Layout;
