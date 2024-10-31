"use client";

import React, { useState } from "react";
import { verifyUser } from "@/actions/users";
import Button from "../button";
import { useTranslations } from "next-intl";

type Props = {
  userId: string;
};

const VerifyButton = ({ userId }: Props) => {
  const t = useTranslations();
  const [isVerifying, setIsVerifying] = useState(false);
  return (
    <Button
      className="w-24"
      onClick={async () => {
        setIsVerifying(true);
        await verifyUser(userId);
        setTimeout(() => {
          setIsVerifying(false);
        }, 1000);
      }}
      isLoading={isVerifying}
    >
      {t("Verify")}
    </Button>
  );
};

export default VerifyButton;
