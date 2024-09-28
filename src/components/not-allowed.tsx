"use client";

import {} from "react";
import Button from "./button";
import { useTranslations } from "next-intl";
import useGetLang from "@/hooks/use-get-lang";

type NotAllowedProps = {};

export const NotAllowed = ({}: NotAllowedProps) => {
  const t = useTranslations();
  const { lang } = useGetLang();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        {t("You are not allowed to view this page")}
      </h1>
      <p className="mb-4">
        {t("You don't have the required permissions to access this page")}
      </p>
      <Button as="link" href={`/${lang}/signin`} className="">
        {t("Sign in")}
      </Button>
    </div>
  );
};
