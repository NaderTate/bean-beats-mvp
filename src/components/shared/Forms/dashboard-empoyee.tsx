"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AdminPermission, User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";

import Input from "../Input";
import Button from "@/components/button";
import FileUploader from "@/components/file-dropzone";

import { createUser, updateUserData } from "@/actions/users";
import Checkbox from "../checkbox";
import { getReadablePermission } from "@/utils/permission-to-text";

type Props = { itemToEdit?: User; onSubmit: () => void };

const DashboardEmployeeForm = ({ itemToEdit: Employee, onSubmit }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<AdminPermission[]>(
    Employee?.permissions || []
  );

  const id = Employee?.id;
  const isEditSession = !!id;

  const t = useTranslations();

  // Create an array of all AdminPermission values
  const allPermissions = Object.values(AdminPermission);

  type Inputs = {
    name: string;
    email: string;
    phone: string;
    password: string;
    image?: string;
    permissions: AdminPermission[];
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      name: Employee?.name || "",
      email: Employee?.email,
      phone: Employee?.phoneNumber || "",
      permissions: Employee?.permissions || [],
    },
  });

  useEffect(() => {
    if (Employee?.permissions) {
      setPermissions(Employee.permissions);
      setValue("permissions", Employee.permissions);
    }
  }, [Employee, setValue]);

  const handlePermissionChange = (permission: AdminPermission) => {
    setPermissions((prevPermissions) => {
      if (prevPermissions.includes(permission)) {
        return prevPermissions.filter((p) => p !== permission);
      } else {
        return [...prevPermissions, permission];
      }
    });
  };

  const submitHandler = async (data: Inputs) => {
    try {
      setIsLoading(true);
      if (isEditSession) {
        const res = await updateUserData({
          id: Employee.id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phone,
          image: data.image,
          permissions: permissions,
        });
        if (res) {
          toast.success(t("Employee updated successfully"));
          onSubmit();
        } else {
          toast.error(t("Failed to update employee"));
        }
        return;
      }
      const res = await createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        image: data.image,
        permissions: permissions,
        role: "PLATFORM_ADMIN",
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

        <div>
          <label className="block mb-2 font-medium">{t("Permissions")}</label>
          <div className="flex flex-wrap gap-2">
            {allPermissions.map((permission) => {
              if (permission === "ALL") return null;
              const readablePermission = getReadablePermission(permission);
              return (
                <Checkbox
                  key={permission}
                  label={readablePermission}
                  checked={permissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                />
              );
            })}
          </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          {isEditSession ? t("Save") : t("Submit")}
        </Button>
      </form>
    </div>
  );
};

export default DashboardEmployeeForm;
