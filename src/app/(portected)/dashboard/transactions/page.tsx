import prisma from "@/lib/prisma";
import PaymentsTable from "../../coffee-shop/payments/payments-table";
export default async function page() {
  const transactions = await prisma.transaction.findMany({
    select: {
      id: true,
      amount: true,
      createdAt: true,
      tableNumber: true,
      _count: { select: { QueueSong: true } },
    },
  });
  return (
    <div className="w-full px-5">
      <PaymentsTable transactions={transactions} />
    </div>
  );
}
