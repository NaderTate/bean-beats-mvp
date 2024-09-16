"use client";

import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { updateUserData } from "@/actions/users";
import Input from "@/components/shared/Input";
import Button from "@/components/button";
import toast from "react-hot-toast";

type Props = {
  shopAdminData: {
    id: string;
    name: string | null | undefined;
    email: string | undefined;
    phoneNumber: string | null | undefined;
  };
};

const SettingsMain = ({ shopAdminData }: Props) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);

  type Inputs = {
    name: string;
    email: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      name: shopAdminData.name || "",
      email: shopAdminData.email || "",
      phoneNumber: shopAdminData.phoneNumber || "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSave = async (data: Inputs) => {
    setIsLoading(true);
    try {
      await updateUserData({
        id: shopAdminData.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber || "",
        ...(data.password && { password: data.password }),
      });
      toast.success(t("Profile updated successfully"));
    } catch (error: any) {
      console.error(error);
      toast.error(t("Failed to update profile"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5">
          <Controller
            control={control}
            name="name"
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Input
                id="name"
                label={t("Name")}
                placeholder={t("Name")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: t("This field is required") }}
            render={({ field }) => (
              <Input
                id="email"
                type="email"
                label={t("Email")}
                placeholder={t("Email")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <Input
                id="phoneNumber"
                label={t("Phone Number")}
                placeholder={t("Phone Number")}
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.phoneNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                id="password"
                label={t("Password")}
                type="password"
                placeholder={t("Password")}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              validate: (value) =>
                value === getValues("password") || t("Passwords do not match"),
            }}
            render={({ field }) => (
              <Input
                id="confirmPassword"
                label={t("Confirm Password")}
                type="password"
                placeholder={t("Confirm Password")}
                onChange={(e) => field.onChange(e.target.value)}
                errMessage={errors.confirmPassword?.message}
              />
            )}
          />
        </div>
        <div className="flex justify-center">
          <Button
            className="w-28 h-12 font-medium text-lg"
            isLoading={isLoading}
            type="submit"
          >
            {t("Save")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsMain;
