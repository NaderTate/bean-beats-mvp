"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { CoffeeShop, User } from "@prisma/client";
import { useForm, Controller } from "react-hook-form";

import Input from "../Input";
import Button from "@/components/button";
import FileUploader from "@/components/file-dropzone";

import { createEmployee } from "@/actions/employee";
import { updateUserData } from "@/actions/users";

type Props = { shopId: string; itemToEdit?: User; onSubmit: () => void };

const EmployeeForm = ({ itemToEdit: Employee, onSubmit, shopId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  Employee;
  const id = Employee?.id;
  const isEditSession = !!id;

  const t = useTranslations();

  type Inputs = {
    name: string;
    email: string;
    phone: string;
    password: string;
    image?: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: Employee?.name || "",
      email: Employee?.email,
      phone: Employee?.phoneNumber || "",
    },
  });

  const submitHandler = async (data: Inputs) => {
    try {
      setIsLoading(true);
      if (isEditSession) {
        const res = await updateUserData({
          name: data.name,
          email: data.email,
          phoneNumber: data.phone,
          password: data.password || "",
          image: data.image,
        });
        if (res) {
          toast.success("Employee updated successfully");
          onSubmit();
        } else {
          toast.error(t("Failed to update employee"));
        }
        return;
      }
      const res = await createEmployee({
        employee: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phone,
          password: data.password,
          image: data.image,
        },
        shopId,
      });
      if (res.error) {
        toast.error(t(res.error));
        return;
      }
      if (res.created) {
        toast.success(t("Employee created successfully"));
        onSubmit();
      } else {
        toast.error(t("Failed to create employee"));
      }
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
        <div className="grid gird-cols-1 md:grid-cols-2 gap-5">
          <Controller
            control={control}
            name="name"
            rules={{ required: "This field is required" }}
            render={({ field }) => (
              <Input
                label="Name"
                placeholder="Name"
                defaultValue={Employee?.name || ""}
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
                disabled={!!isEditSession}
                defaultValue={Employee?.email}
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
                defaultValue={Employee?.phoneNumber || ""}
                label="Phone"
                placeholder="Phone"
                onChange={(e) => {
                  field.onChange(e.target.value);
                }}
                errMessage={errors.phone?.message}
              />
            )}
          />
          {!isEditSession && (
            <Controller
              control={control}
              name="password"
              rules={{ required: !isEditSession && "This field is required" }}
              render={({ field }) => (
                <Input
                  defaultValue={Employee?.password || ""}
                  label="Password"
                  placeholder="Password"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  errMessage={errors.password?.message}
                />
              )}
            />
          )}
        </div>

        <Controller
          control={control}
          name="image"
          render={({ field }) => (
            <FileUploader
              defaultImageUrl={Employee?.image || ""}
              label="Image"
              onFileUpload={(url) => field.onChange(url)}
              errorMessage={errors.image?.message}
            />
          )}
        />

        <Button type="submit" isLoading={isLoading}>
          {t("Submit")}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeForm;
