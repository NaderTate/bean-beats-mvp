import { NextPage } from "next";
import prisma from "@/lib/prisma";

import EmployeesMain from "./main";

import { getCoffeeShop } from "@/utils/get-user";

type EmployessPageProps = {};

const EmployessPage: NextPage = async ({}: EmployessPageProps) => {
  const { coffeeShop } = await getCoffeeShop();
  if (!coffeeShop)
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <h1 className="font-bold text-lg">Coffee shop not found :(</h1>
      </div>
    );
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
