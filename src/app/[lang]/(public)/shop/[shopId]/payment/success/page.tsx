"use client";

import { NextPage } from "next";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { FaCircleCheck } from "react-icons/fa6";

type PaymentSuccessPageProps = { params: { shopId: string } };

const PaymentSuccessPage: NextPage<PaymentSuccessPageProps> = ({
  params: { shopId },
}) => {
  const router = useRouter();
  const t = useTranslations();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/shop/${shopId}/queue`);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [router, shopId]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center p-10 gap-5">
        <FaCircleCheck className="text-green-500" size={45} />
        <h1 className="text-3xl font-semibold">{t("Thank You!")}</h1>
        <p className="text-gray-500">{t("Your payment was successful")}</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
