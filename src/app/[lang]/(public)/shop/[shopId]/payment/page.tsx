import { NextPage } from "next";
import { PaymentMain } from "./main";

type PaymentPageProps = { params: { shopId: string } };

const PaymentPage = async ({ params: { shopId } }: PaymentPageProps) => {
  return (
    <div className="mt-28 px-14">
      <PaymentMain shopId={shopId} />
    </div>
  );
};

export default PaymentPage;
