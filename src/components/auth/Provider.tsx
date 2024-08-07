"use client";

import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { CoffeeShop, UserRole } from "@prisma/client";
import { User } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
const Provider = ({
  children,
  userRole,
  sessionUser,
  coffeeShops,
}: Readonly<{
  sessionUser: User | null | undefined;
  children: React.ReactNode;
  coffeeShops: CoffeeShop[];
  userRole: UserRole | undefined;
}>) => {
  const { push } = useRouter();
  const pathname = usePathname();

  if (pathname.includes("/dashboard") && !pathname.includes("/coffee-shop")) {
    if (!sessionUser || userRole !== "PLATFORM_ADMIN") {
      push("/signin");
    }
  }
  if (pathname === "/coffee-shop") {
    push("/coffee-shop/dashboard");
  }
  if (pathname.includes("/coffee-shop")) {
    if (coffeeShops.length === 0) {
      return <div>You don&apos;t have any coffee shops</div>;
    }
    if (!sessionUser || userRole !== "SHOP_ADMIN") {
      push("/signin");
    }
  }

  const initialOptions: ReactPayPalScriptOptions = {
    vault: true,
    currency: "USD",
    intent: "capture",
    components: "buttons",
    enableFunding: "venmo",
    // environment: "sandbox",
    "data-page-type": "product-details",
    dataSdkIntegrationSource: "developer-studio",
    clientId:
      "Ac23dh7ZAT4oUT4xlBxg5Jdqs9VYpF9r7yYauecxgURDMe3SwxUgj9hyLRYHdDxqAJXFdZb3kgMGeXaB",
  };
  return (
    <SessionProvider
      refetchInterval={15 * 60 * 1000} // 2 minutes
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <PayPalScriptProvider options={initialOptions}>
        {children}
      </PayPalScriptProvider>
    </SessionProvider>
  );
};

export default Provider;
