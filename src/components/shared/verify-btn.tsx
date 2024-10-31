"use client";

import React, { useState } from "react";
import { verifyUser } from "@/actions/users";
import Button from "../button";

type Props = {
  userId: string;
};

const VerifyButton = ({ userId }: Props) => {
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
      Verify
    </Button>
  );
};

export default VerifyButton;
