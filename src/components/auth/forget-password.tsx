"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";

import Button from "../button";
import Input from "../shared/Input";
import Spinner from "@/components/shared/spinner";

type Props = {};

const ForgotPasswordForm = ({}: Props) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  type Inputs = {
    email: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const submitHandler = async (data: Inputs) => {
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email: data.email }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 404) {
      setError("User not found");
      setIsLoading(false);
      return;
    }

    toast.success(t("Password reset link sent successfully"));
    setIsLoading(false);
    setIsEmailSent(true);
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <h2 className="text-2xl font-semibold">{t("Forget Password")}</h2>
      <h4 className="text-[#989898] font-medium">
        {t("Don't worry! It occurs")}
      </h4>
      <h4 className="text-[#989898] font-medium">
        {t("Please enter the email address linked withyour account")}
      </h4>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "This field is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address",
          },
        }}
        render={({ field }) => (
          <Input
            required
            type="email"
            label="Email"
            placeholder="Enter your email address"
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.email?.message}
          />
        )}
      />

      {isEmailSent && (
        <p className="text-start text-sm text-gray-500">
          If the email exists in our system, you will receive a password reset
          link shortly.
        </p>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={isLoading}
        className="transition w-full bg-[#341E0C] text-white py-2 px-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center"
      >
        {isLoading ? <Spinner /> : t("Reset Password")}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
