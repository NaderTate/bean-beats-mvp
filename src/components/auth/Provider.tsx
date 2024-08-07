"use client";

import {
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { UserRole } from "@prisma/client";
import { User } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
const Provider = ({
  children,
  userRole,
  sessionUser,
}: Readonly<{
  children: React.ReactNode;
  userRole: UserRole | undefined;
  sessionUser: User | null;
}>) => {
  const { push } = useRouter();
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) {
  }
  if (pathname.includes("/coffee-shop")) {
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
