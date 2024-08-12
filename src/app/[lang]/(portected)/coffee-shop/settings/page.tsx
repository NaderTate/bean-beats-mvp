import { NextPage } from "next";

import SettingsMain from "./main";

import prisma from "@/lib/prisma";
import { getUser } from "@/utils/get-user";

type SettingsPageProps = {};

const SettingsPage: NextPage = async ({}: SettingsPageProps) => {
  const user = await getUser();
  const userData = user
    ? await prisma.user.findUnique({
        where: { id: user?.id },
      })
    : null;

  return (
    <>
      <SettingsMain
        shopAdminData={{
          email: userData?.email,
          name: userData?.name,
          phoneNumber: userData?.phoneNumber,
        }}
      />
    </>
  );
};

export default SettingsPage;
