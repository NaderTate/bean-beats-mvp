"use client";

import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { User } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { CoffeeShop, UserRole } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import useGetLang from "@/hooks/use-get-lang";

const Provider = ({
  children,
  userRole,
  sessionUser,
}: Readonly<{
  children: React.ReactNode;
  coffeeShops: CoffeeShop[];
  userRole: UserRole | undefined;
  sessionUser: User | null | undefined;
}>) => {
  const { push } = useRouter();
  const pathname = usePathname();
  // const { lang } = useGetLang();

  if (pathname.includes("/dashboard") && !pathname.includes("/coffee-shop")) {
    if (!sessionUser) {
      push("/signin");
    }
    if (userRole !== "PLATFORM_ADMIN") {
      push("/dashboard");
    }
  }
  if (pathname === "/coffee-shop") {
    push("/coffee-shop/dashboard");
  }
  if (pathname.includes("/coffee-shop") && sessionUser) {
    // if (coffeeShops.length === 0) {
    //   return <div>You don&apos;t have any coffee shops</div>;
    // }
    if (!sessionUser) {
      push("/signin");
    }
    // if (userRole == "EMPLOYEE" || userRole == "SHOP_ADMIN") {
    //   push(`/${lang}/coffee-shop/dashboard`);
    // }
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
      refetchWhenOffline={false}
      refetchOnWindowFocus={false}
      refetchInterval={15 * 60 * 1000}
    >
      <PayPalScriptProvider options={initialOptions}>
        {children}
      </PayPalScriptProvider>
    </SessionProvider>
  );
};

export default Provider;
