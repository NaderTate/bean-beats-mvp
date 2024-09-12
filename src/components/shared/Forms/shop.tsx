"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { CoffeeShop, User } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";

import Input from "../Input";
import Button from "@/components/button";
import FileUploader from "@/components/file-dropzone";

import { updateUserData } from "@/actions/users";
import { createShopWithAdmin, updateShop } from "@/actions/shops";

type Props = {
  itemToEdit?: CoffeeShop & { admin: User };
  onSubmit: () => void;
};

const ShopForm = ({ itemToEdit: Shop, onSubmit }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const id = Shop?.id;
  const isEditSession = !!id;
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
    defaultValues: {
      shopName: Shop?.name,
      shopAddress: Shop?.address,
      shopLogo: Shop?.logo,
      shopAdminName: Shop?.admin.name || "",
      shopAdminEmail: Shop?.admin.email || "",
      shopAdminPhone: Shop?.admin.phoneNumber || "",
      shopAdminImage: Shop?.admin.image || "",
    },
  });

  const submitHandler = async (data: Inputs) => {
    try {
      setIsLoading(true);
      if (isEditSession) {
        const updatingAdmin = await updateUserData({
          id: Shop.admin.id,
          name: data.shopAdminName,
          email: data.shopAdminEmail,
          phoneNumber: data.shopAdminPhone,
          image: data.shopAdminImage,
        });
        if (!updatingAdmin) {
          toast.error(t("Failed to update admin"));
          return;
        }
        const res = await updateShop(id, {
          name: data.shopName,
          address: data.shopAddress,
          logo: data.shopLogo,
        });
        if (res.updated) {
          toast.success(t("Shop updated successfully"));
          onSubmit();
        } else {
          toast.error(t("Failed to update shop"));
        }
      } else {
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
          toast.success(t("Shop created successfully"));
        } else {
          toast.error(t("Failed to create shop"));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <Controller
          control={control}
          name="shopName"
          rules={{ required: "This field is required" }}
          render={({ field }) => (
            <Input
              label="Shop Name"
              defaultValue={Shop?.name}
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
              defaultValue={Shop?.address}
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
              defaultImageUrl={Shop?.logo || undefined}
              onFileUpload={(url) => field.onChange(url)}
            />
          )}
        />

        <>
          <div className="grid gird-cols-1 md:grid-cols-2 gap-5">
            <Controller
              control={control}
              name="shopAdminName"
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <Input
                  label="Admin Name"
                  placeholder="Admin Name"
                  defaultValue={Shop?.admin.name || ""}
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
                  defaultValue={Shop?.admin.email || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  label="Admin Email"
                  placeholder="Admin Email"
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
                  label="Admin Phone"
                  placeholder="Admin Phone"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  defaultValue={Shop?.admin.phoneNumber || ""}
                  errMessage={errors.shopAdminPhone?.message}
                />
              )}
            />
            {!isEditSession && (
              <Controller
                control={control}
                name="shopAdminPassword"
                rules={{ required: "This field is required" }}
                render={({ field }) => (
                  <Input
                    label="Admin Password"
                    placeholder="Admin Password"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    errMessage={errors.shopAdminPassword?.message}
                  />
                )}
              />
            )}
          </div>

          <Controller
            control={control}
            name="shopAdminImage"
            render={({ field }) => (
              <FileUploader
                label="Admin Image"
                onFileUpload={(url) => field.onChange(url)}
                errorMessage={errors.shopAdminImage?.message}
              />
            )}
          />
        </>

        <Button isLoading={isLoading} type="submit">
          {t("Submit")}
        </Button>
      </form>
    </div>
  );
};

export default ShopForm;
