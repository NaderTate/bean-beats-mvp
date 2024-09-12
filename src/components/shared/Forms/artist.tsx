"use client";
import { Controller, useForm } from "react-hook-form";
import { Artist } from "@prisma/client";

import { updateArtist, isArtistExisting } from "@/actions/artists";
import { useTranslations } from "next-intl";
import Input from "../Input";
import FileUploader from "@/components/file-dropzone";
import Button from "@/components/button";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
  image: string;
};

export default function ArtistForm({
  onSubmit,
  itemToEdit: artist,
}: {
  onSubmit: () => void;
  itemToEdit?: Artist;
}) {
  const id = artist?.id;
  const {
    control,
    register,
    handleSubmit,
    formState: { isLoading, isSubmitting, errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: artist?.name,
      image: artist?.image,
    },
  });

  const t = useTranslations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (id) {
          const isExisting = await isArtistExisting({
            artistName: data.name,
            artistId: id,
          });

          if (isExisting) {
            toast.error("An artist with this name already exists");
            return;
          }

          await updateArtist({
            id,
            data,
          });

          toast.success(t("Artist updates successfully"));
        } else {
          const isExisting = await isArtistExisting({
            artistName: data.name,
          });

          if (isExisting) {
            toast.error("An artist with this name already exists");
            return;
          }
          await fetch("/api/artists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          toast.success(t("Artist created successfully"));
        }

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
            defaultValue={artist?.name || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.name?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="image"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <FileUploader
            defaultImageUrl={artist?.image || ""}
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
