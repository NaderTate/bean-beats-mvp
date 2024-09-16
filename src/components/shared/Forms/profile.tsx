"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";

import Input from "../Input";
import Button from "@/components/button";
import FileUploader from "@/components/file-dropzone";

import { updateUserData } from "@/actions/users";

type Props = { itemToEdit: User; onSubmit: () => void };

const ProfileForm = ({ itemToEdit: User, onSubmit }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  User;
  const id = User?.id;
  const isEditSession = !!id;

  const t = useTranslations();

  type Inputs = {
    name: string;
    email: string;
    phone: string;
    image?: string;
    password: string;
    confirmPassword: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<Inputs>({
    defaultValues: {
      name: User?.name || "",
      email: User?.email,
      phone: User?.phoneNumber || "",
      image: User?.image || "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitHandler = async (data: Inputs) => {
    try {
      setIsLoading(true);

      const res = await updateUserData({
        id: User.id,
        name: data.name,
        email: data.email,
        image: data.image,
        phoneNumber: data.phone,
        ...(data.password && { password: data.password }),
      });
      if (res) {
        toast.success(t("Data updated successfully"));
        onSubmit();
      } else {
        toast.error(t("Failed to update data"));
      }
      return;
    } catch (error: any) {
      console.log(error);
      toast.error(t(error.error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            control={control}
            name="name"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Input
                label="Name"
                placeholder="Name"
                defaultValue={User?.name || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                errMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Input
                defaultValue={User?.email}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                label="Email"
                placeholder="Email"
                errMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Input
                label="Phone"
                placeholder="Phone"
                defaultValue={User?.phoneNumber || ""}
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                errMessage={errors.phone?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: !isEditSession && "This field is required" }}
            render={({ field }) => (
              <Input
                label="New Password"
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                errMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: !isEditSession && "This field is required",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            }}
            render={({ field }) => (
              <Input
                label="Confirm Password"
                placeholder="Password"
                type="password"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                errMessage={errors.confirmPassword?.message}
              />
            )}
          />
        </div>

        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <FileUploader
              label="Image"
              accept="image/*"
              defaultImageUrl={User?.image || ""}
              errorMessage={errors.image?.message}
              onFileUpload={(url) => field.onChange(url)}
            />
          )}
        />

        <Button type="submit" isLoading={isLoading}>
          {isEditSession ? t("Save") : t("Submit")}
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
