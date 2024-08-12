import { NextPage } from "next";
import prisma from "@/lib/prisma";

import { getUser } from "@/utils/get-user";
import PaymentsTable from "./payments-table";

type PaymentsPageProps = {};

const PaymentsPage: NextPage = async ({}: PaymentsPageProps) => {
  const user = await getUser();
  const coffeeShop = user
    ? await prisma.coffeeShop.findFirst({
        where: { adminId: user?.id },
        select: {
          Transactions: {
            select: {
              id: true,
              amount: true,
              createdAt: true,
              tableNumber: true,
              _count: { select: { QueueSong: true } },
            },
          },
        },
      })
    : null;
  return (
    <>
      {coffeeShop && <PaymentsTable transactions={coffeeShop?.Transactions} />}
    </>
  );
};

export default PaymentsPage;