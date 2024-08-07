import prisma from "@/lib/prisma";

import Main from "./Main";

export default async function Page() {
  const users = await prisma.user.findMany();
  return <Main users={users} />;
}
