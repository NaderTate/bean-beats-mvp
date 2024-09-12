import Dashboard from "@/components/shared/dashboard-nav";
import { getUser } from "@/utils/get-user";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await getUser();
  if (!user) return null;

  return (
    <div className="flex min-h-screen overflow-x-hidden px-5">
      <Dashboard user={user} />
      {children}
    </div>
  );
};

export default Layout;
