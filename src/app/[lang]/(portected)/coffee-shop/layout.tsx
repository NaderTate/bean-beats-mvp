import { redirect } from "next/navigation";

import Navbar from "./navbar";
import Sidebar from "./sidebar";

import { getCoffeeShop } from "@/utils/get-user";
import Script from "next/script";

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
      <Script
        strategy="beforeInteractive"
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAEbC_5lROtxVBF85pkfTIiTsCLDn1in7Y&libraries=places"
      />
      <Navbar shopId={coffeeShop.id} />
      <Sidebar />
      <div className="mt-20 w-full px-5">{children}</div>
    </div>
  );
};

export default Layout;
