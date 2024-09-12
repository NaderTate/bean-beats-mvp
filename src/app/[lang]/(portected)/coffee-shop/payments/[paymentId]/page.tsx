import prisma from "@/lib/prisma";
import Main from "./main";
type PayemtPageProps = {
  params: {
    paymentId: string;
  };
};

const PayemtPage = async ({ params: { paymentId } }: PayemtPageProps) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: paymentId,
    },
    // include: {
    //   songs: { include: { artist: { select: { name: true, image: true } } } },
    // },
  });
  if (transaction)
    return (
      <>
        <Main transaction={transaction} />
      </>
    );
};

export default PayemtPage;
