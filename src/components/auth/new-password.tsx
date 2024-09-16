"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import Input from "../shared/Input";
import Button from "../button";
import Spinner from "@/components/shared/spinner";
import useGetLang from "@/hooks/use-get-lang";
import { updateUserPassword } from "@/actions/users";

type Props = {
  setSection: (section: string) => void;
};

type Inputs = {
  password: string;
  confirmPassword: string;
};

const NewPasswordForm = ({ setSection }: Props) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { lang } = useGetLang();
  const { push } = useRouter();
  const userId = searchParams.get("userid");

  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Inputs>();

  if (!userId) {
    return <div>User not found</div>;
  }

  const submitHandler = async (data: Inputs) => {
    setIsLoading(true);

    try {
      await updateUserPassword({ userId, password: data.password });
      toast.success(t("Password updated successfully"));
      setSection("login");
      push(`/${lang}/signin`);
    } catch (error) {
      toast.error(t("Error updating password"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create new Password</h2>
      <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
        <Controller
          control={control}
          name="password"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Input
              required
              type="password"
              label="New Password"
              placeholder="New Password"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              errMessage={errors.password?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "This field is required",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          }}
          render={({ field }) => (
            <Input
              required
              type="password"
              label="Confirm Password"
              placeholder="Confirm New Password"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              errMessage={errors.confirmPassword?.message}
            />
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="transition w-full bg-primary-900 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex justify-center"
        >
          {isLoading ? <Spinner /> : "Update Password"}
        </Button>
      </form>
    </div>
  );
};

export default NewPasswordForm;
