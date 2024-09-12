"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";

import Input from "../shared/Input";
import Button from "@/components/button";
import FileUploader from "@/components/file-dropzone";

import { createShopWithAdmin } from "@/actions/shops";

type Props = {
  onSubmit: () => void;
};

const CreateAccount = ({ onSubmit }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const t = useTranslations();

  type Inputs = {
    shopName: string;
    shopAddress: string;
    shopLogo: string | null;
    shopAdminName: string;
    shopAdminEmail: string;
    shopAdminPhone: string;
    shopAdminPassword: string;
    shopAdminImage?: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    // defaultValues: {
    //   shopName: Shop?.name,
    //   shopAddress: Shop?.address,
    //   shopLogo: Shop?.logo,
    //   shopAdminName: Shop?.admin.name || "",
    //   shopAdminEmail: Shop?.admin.email || "",
    //   shopAdminPhone: Shop?.admin.phoneNumber || "",
    //   shopAdminImage: Shop?.admin.image || "",
    // },
  });

  const submitHandler = async (data: Inputs) => {
    try {
      setIsLoading(true);

      const res = await createShopWithAdmin({
        shop: {
          name: data.shopName,
          address: data.shopAddress,
          logo: data.shopLogo,
        },
        admin: {
          name: data.shopAdminName,
          email: data.shopAdminEmail,
          phoneNumber: data.shopAdminPhone,
          password: data.shopAdminPassword,
          image: data.shopAdminImage,
        },
      });
      if (res.created) {
        onSubmit();
        toast.success(t("Account created successfully"));
      } else {
        toast.error(t("Failed to create account"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-80">
      <h1 className="font-bold text-2xl text-center mb-5">
        {t("Create a new account")}
      </h1>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <>
          <div className="grid gird-cols-1 md:grid-cols-2 gap-5">
            <Controller
              control={control}
              name="shopAdminName"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Input
                  label="Name"
                  placeholder="Name"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errMessage={errors.shopAdminName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="shopAdminEmail"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Input
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="Email"
                  placeholder="Email"
                  errMessage={errors.shopAdminEmail?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="shopAdminPhone"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Input
                  label="Phone"
                  placeholder="Phone"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errMessage={errors.shopAdminPhone?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="shopAdminPassword"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Input
                  type="password"
                  label="Password"
                  placeholder="Password"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errMessage={errors.shopAdminPassword?.message}
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="shopAdminImage"
            render={({ field }) => (
              <FileUploader
                label="Image"
                onFileUpload={(url) => field.onChange(url)}
                errorMessage={errors.shopAdminImage?.message}
              />
            )}
          />
        </>
        <Controller
          control={control}
          name="shopName"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Input
              label="Shop Name"
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              placeholder="Shop Name"
              errMessage={errors.shopName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="shopAddress"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Input
              label="Shop Address"
              placeholder="Shop Address"
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              errMessage={errors.shopAddress?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="shopLogo"
          render={({ field }) => (
            <FileUploader
              label="Shop Logo"
              errorMessage={errors.shopLogo?.message}
              onFileUpload={(url) => field.onChange(url)}
            />
          )}
        />

        <Button className="w-full py-3" isLoading={isLoading} type="submit">
          {t("Create Account")}
        </Button>
      </form>
    </div>
  );
};

export default CreateAccount;
