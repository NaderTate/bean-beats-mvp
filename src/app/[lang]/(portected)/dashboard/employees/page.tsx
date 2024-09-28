import { NextPage } from "next";
import prisma from "@/lib/prisma";
import EmployeesMain from "./main";

type EmployeesPageProps = {};

const EmployeesPage: NextPage = async ({}: EmployeesPageProps) => {
  const employees = await prisma.user.findMany({
    where: {
      role: "PLATFORM_ADMIN",
      NOT: {
        permissions: {
          has: "ALL",
        },
      },
    },
  });

  return (
    <>
      <EmployeesMain employees={employees} />
    </>
  );
};

export default EmployeesPage;
