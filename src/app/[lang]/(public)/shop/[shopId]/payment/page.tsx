import { getCoffeeShop } from "@/utils/get-user";
import { PaymentMain } from "./main";

type PaymentPageProps = { params: { shopId: string } };

const PaymentPage = async ({ params: { shopId } }: PaymentPageProps) => {
  const { coffeeShop } = await getCoffeeShop();
  return (
    <div className="mt-28 px-14">
      <PaymentMain shopId={shopId} songPrice={coffeeShop?.songPrice || 1} />
    </div>
  );
};

export default PaymentPage;
