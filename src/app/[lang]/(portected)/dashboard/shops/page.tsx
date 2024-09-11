import prisma from "@/lib/prisma";

import { NextPage } from "next";
import ShopsMain from "./main";

type ShopPageProps = {};

const ShopPage: NextPage = async ({}: ShopPageProps) => {
  const shops = await prisma.coffeeShop.findMany({
    orderBy: { id: "desc" },
    include: { admin: true },
  });
  return (
    <>
      <ShopsMain shops={shops} />
    </>
  );
};

export default ShopPage;
