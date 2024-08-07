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
  return <>{children}</>;
};

export default Layout;
