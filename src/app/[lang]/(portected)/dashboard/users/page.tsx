import prisma from "@/lib/prisma";

import Main from "./Main";
import { getUser } from "@/utils/get-user";

export default async function Page() {
  const user = await getUser();
  // get users except the current user
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
    },
  });
  return <Main users={users} />;
}
