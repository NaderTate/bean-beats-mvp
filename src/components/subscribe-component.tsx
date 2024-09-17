"use client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Button from "./button";
import { FaCreditCard } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { createTransaction } from "@/actions/transactions";
import useGetLang from "@/hooks/use-get-lang";
import { useState } from "react";
import { useSongsCart } from "@/store/songs-cart";
type props = {
  price: string;
  description: string;
  shopId: string;
  tableNumber: number;
  songsIds: string[];
};
const SubscribeComponent = ({
  price,
  description,
  shopId,
  tableNumber,
  songsIds,
}: props) => {
  const t = useTranslations();
  const { lang } = useGetLang();
  const [isLoading, setIsLoading] = useState(false);
  console.log({
    songsIds,
    description,
    price,
    shopId,
    tableNumber,
  });
  const handleSubmit = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
    );
    if (!stripe) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post("/api/stripe/checkout", {
        price,
        description,
        shopId,
        lang,
        tableNumber,
        songsIds,
      });
      const data = response.data;
      if (!data.ok) {
        setIsLoading(false);
        throw new Error("Something went wrong");
      }

      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <div>
      <Button
        isLoading={isLoading}
        className="w-full mb-5"
        startIcon={<FaCreditCard className="mx-2" />}
        onClick={handleSubmit}
      >
        {t("Checkout")}
      </Button>
    </div>
  );
};
export default SubscribeComponent;
