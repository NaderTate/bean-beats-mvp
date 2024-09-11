"use client";
import { Controller, useForm } from "react-hook-form";
import Spinner from "../spinner";

import { createGenre, updateGenre } from "@/actions/gneres";
import { Genre } from "@prisma/client";
import { useTranslations } from "next-intl";
import Input from "../Input";
import FileUploader from "@/components/file-dropzone";
import Button from "@/components/button";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
  image: string;
};

interface GenreFormProps {
  onSubmit: () => void;
  itemToEdit?: Genre;
}

function GenreForm({ onSubmit, itemToEdit: genre }: GenreFormProps) {
  const id = genre?.id;

  const {
    control,
    handleSubmit,
    formState: { isLoading, isSubmitting, errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: genre?.name,
      image: genre?.image,
    },
  });

  const t = useTranslations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (id) {
          await updateGenre({
            id,
            data,
          });
          toast.success(t("Genre updated successfully"));
        } else {
          await createGenre({
            data,
          });
          toast.success(t("Genre created successfully"));
        }
        id;

        onSubmit();
      })}
      className="space-y-4"
    >
      <Controller
        control={control}
        name="name"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Input
            label={"Name"}
            placeholder="Name"
            defaultValue={genre?.name || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        name="image"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <FileUploader
            defaultImageUrl={genre?.image || ""}
            label="Image"
            onFileUpload={(url) => field.onChange(url)}
            errorMessage={errors.image?.message}
          />
        )}
      />

      <Button className="mt-4" isLoading={isSubmitting || isLoading}>
        {t("Submit")}
      </Button>
    </form>
  );
}

export default GenreForm;
