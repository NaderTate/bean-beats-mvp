"use client";

import { useTranslations } from "next-intl";
import React from "react";
import { BiSolidErrorCircle } from "react-icons/bi";
import { signOut } from "next-auth/react";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";

type Props = {};

const NotVerified = ({}: Props) => {
  const t = useTranslations();
  const { push } = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-white border-l-4 border-amber-500 rounded-lg shadow-lg p-6 max-w-md w-full mb-4">
        <div className="flex items-start space-x-3">
          <BiSolidErrorCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {t("Account Pending Verification")}
            </h2>
            <p className="text-sm text-gray-600">
              {t(
                "Your account is currently under review, Our administrators will verify your account soon, You will have access to all features once your account has been verified, Thank you for your patience"
              )}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          signOut({ callbackUrl: "/signin" });
          push("/signin");
        }}
        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-md 
                   text-gray-600 hover:text-gray-900 hover:bg-gray-50 
                   transition-all duration-200 ease-in-out
                   border border-gray-200 hover:border-gray-300"
      >
        <HiOutlineLogout className="h-5 w-5 text-amber-500" />
        <span className="text-sm font-medium">{t("Sign Out")}</span>
      </button>
    </div>
  );
};

export default NotVerified;
