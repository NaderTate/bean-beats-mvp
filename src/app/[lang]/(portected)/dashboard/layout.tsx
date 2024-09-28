import { headers } from "next/headers";
import { getUser } from "@/utils/get-user";
import Dashboard from "@/components/shared/dashboard-nav";
import { adminNavLinks } from "@/admin-nav-links";
import { NotAllowed } from "@/components/not-allowed";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const headersList = headers();
  const url = headersList.get("x-url") || ""; // Use x-url header instead of referer
  const user = await getUser();

  if (!user) return null;

  // Function to remove language code from path
  const removeLanguageCode = (path: string) => {
    const parts = path.split("/");
    if (parts.length > 1 && parts[1].length === 2) {
      return "/" + parts.slice(2).join("/");
    }
    return path;
  };

  // Remove language code from current path
  const normalizedPath = removeLanguageCode(url);

  // Find the matching link in adminNavLinks
  const currentLink = adminNavLinks.find((link) =>
    normalizedPath.startsWith(link.href)
  );

  // Check if the user has permission to view the current page
  const hasPermission = currentLink
    ? user.permissions.includes(currentLink.requiredPermission) ||
      user.permissions.includes("ALL")
    : true; // If no matching link is found, we assume it's a public page

  if (!hasPermission) {
    return <NotAllowed />;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden px-5">
      <Dashboard user={user} />
      {children}
    </div>
  );
};

export default Layout;
