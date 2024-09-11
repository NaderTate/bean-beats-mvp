import { NextPage } from "next";
import prisma from "@/lib/prisma";

import EmployeesMain from "./main";

import { getCoffeeShop } from "@/utils/get-user";

type EmployessPageProps = {};

const EmployessPage: NextPage = async ({}: EmployessPageProps) => {
  const coffeeShop = await getCoffeeShop();
  if (!coffeeShop) return <></>;
  const employees = await prisma.coffeeShopOnEmployee.findMany({
    where: { coffeeShopId: coffeeShop.id },
    include: { user: true },
  });
  return (
    <>
      <EmployeesMain
        shopId={coffeeShop.id}
        employees={employees.map((employee) => employee.user)}
      />
    </>
  );
};

export default EmployessPage;
