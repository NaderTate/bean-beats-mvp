import prisma from "@/lib/prisma";
import Main from "@/app/[lang]/(portected)/coffee-shop/payments/[paymentId]/main";
type TransactionPageProps = { params: { transactionId: string } };

const TransactionPage = async ({
  params: { transactionId },
}: TransactionPageProps) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      songs: { include: { artist: { select: { name: true, image: true } } } },
    },
  });

  if (!transaction) {
    return <div>Transaction not found</div>;
  }
  return (
    <>
      <Main transaction={transaction} />
    </>
  );
};

export default TransactionPage;
