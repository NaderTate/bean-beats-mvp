"use client";
import { Controller, useForm } from "react-hook-form";

import { Album, Artist } from "@prisma/client";
import Select from "../Select";
import { updateAlbum } from "@/actions/albums";
import { useTranslations } from "next-intl";
import Input from "../Input";
import FileUploader from "@/components/file-dropzone";
import Button from "@/components/button";

interface AlbumFormProps {
  onSubmit: () => void;
  artists: Artist[];
  itemToEdit?: Album;
}

type Inputs = {
  name: string;
  year: number;
  artistId: string;
  image: string;
};

export default function AlbumForm({
  onSubmit,
  artists,
  itemToEdit: album,
}: AlbumFormProps) {
  const id = album?.id;
  const {
    control,
    register,
    handleSubmit,
    formState: { isLoading, isSubmitting, errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: album?.name,
      artistId: album?.artistId,
      image: album?.image,
      year: album?.year || new Date().getFullYear(),
    },
  });

  const artistOptions = artists.map((artist) => ({
    value: artist.id,
    title: artist.name,
  }));

  const t = useTranslations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (id) {
          await updateAlbum({
            id,
            data: {
              ...data,
              year: Number(data.year),
              image: data.image,
            },
          });
        } else {
          await fetch("/api/albums", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              year: Number(data.year),
              image: data.image,
            }),
          });
        }

        onSubmit();
      })}
      className="space-y-4"
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Input
            label={"Name"}
            placeholder="Name"
            defaultValue={album?.name || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="year"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Input
            label={"Year"}
            placeholder="Year"
            defaultValue={album?.year || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.name?.message}
          />
        )}
      />

      <Select
        id="artist"
        label={t("Artist")}
        options={artistOptions}
        {...register("artistId", {
          required: "This field is required",
        })}
        errMessage={errors.artistId?.message}
      />

      <Controller
        control={control}
        name="image"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <FileUploader
            defaultImageUrl={album?.image || ""}
            label="Image"
            onFileUpload={(url) => field.onChange(url)}
            errorMessage={errors.image?.message}
          />
        )}
      />

      <Button className="mt-4" isLoading={isSubmitting || isLoading}>
        Submit
      </Button>
    </form>
  );
}
