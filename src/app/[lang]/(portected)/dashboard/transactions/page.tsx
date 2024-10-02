import prisma from "@/lib/prisma";
import PaymentsTable from "../../coffee-shop/payments/payments-table";

interface pageProps {
  params: {
    lang: string;
  };
}
export default async function page({ params: { lang } }: pageProps) {
  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      amount: true,
      createdAt: true,
      tableNumber: true,
      shop: {
        select: {
          name: true,
          country: true,
          city: true,
          logo: true,
          songPrice: true,
          phone: true,
        },
      },
      _count: { select: { QueueSong: true } },
    },
  });
  return (
    <div className="w-full px-5">
      <PaymentsTable
        viewShopFilter={true}
        transactions={transactions}
        viewLink={`/${lang}/dashboard/transactions`}
      />
    </div>
  );
}
