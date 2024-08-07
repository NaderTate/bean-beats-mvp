import Navbar from "./navbar";
import Sidebar from "./sidebar";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex">
      <Navbar />
      <Sidebar />
      <div className="pl-5 mt-20 w-full">{children}</div>
    </div>
  );
};

export default Layout;
