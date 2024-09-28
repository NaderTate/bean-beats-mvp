"use client";

import { useTranslations } from "next-intl";

import Button from "./button";

import useGetLang from "@/hooks/use-get-lang";

type Props = { shopId: string; onSubmit: () => void };

const CompleteProfileWarning = ({ shopId, onSubmit }: Props) => {
  const t = useTranslations();
  const { lang } = useGetLang();
  return (
    <div>
      <h1 className="text-2xl font-bold">{t("Complete your data")}</h1>
      <p>
        {t("You need to complete your shop data before taking this action")}
      </p>
      <Button
        onClick={onSubmit}
        as="link"
        href={`/${lang}/coffee-shop/settings`}
        className="mt-5"
      >
        {t("Complete your data")}
      </Button>
    </div>
  );
};

export default CompleteProfileWarning;
