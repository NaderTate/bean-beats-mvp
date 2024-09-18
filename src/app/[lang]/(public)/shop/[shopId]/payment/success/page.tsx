"use client";

import { NextPage } from "next";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import { FaCircleCheck } from "react-icons/fa6";
import { createTransaction } from "@/actions/transactions";
import { useSongsCart } from "@/store/songs-cart";

type PaymentSuccessPageProps = { params: { shopId: string } };

const PaymentSuccessPage: NextPage<PaymentSuccessPageProps> = ({
  params: { shopId },
}) => {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const tableNumber = Number(searchParams.get("tableNumber")) || 0;
  // const songsIds = searchParams.get("songsIds") || "";
  // const arrayOfSongs = songsIds.split(",");

  const { setSongs: setLocalSongs } = useSongsCart();

  const handleTransaction = async () => {
    const storedSongs = localStorage.getItem("songs");
    const songs = storedSongs ? JSON.parse(storedSongs) : {};
    await createTransaction({
      shopId,
      songsQuantities: songs,
      tableNumber,
    });
    router.push(`/shop/${shopId}/queue`);
    localStorage.removeItem("songs");
    setLocalSongs({});
  };
  useEffect(() => {
    handleTransaction();
  }, [shopId, tableNumber, setLocalSongs]);

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
