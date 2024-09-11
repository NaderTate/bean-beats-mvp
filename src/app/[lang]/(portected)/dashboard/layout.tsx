import Dashboard from "@/components/shared/dashboard-nav";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex min-h-screen overflow-x-hidden px-5">
      <Dashboard />
      {children}
    </div>
  );
};

export default Layout;
