"use client";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";

import Spinner from "../spinner";
import { Album, Artist } from "@prisma/client";
import Select from "../Select";
import { updateAlbum } from "@/actions/albums";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Input from "../Input";
import { uploadFile } from "@/utils/upload-files";
import FileUploader from "@/components/file-dropzone";

interface AlbumFormProps {
  onSubmit: () => void;
  artists: Artist[];
  itemToEdit?: Album;
}

type Inputs = {
  name: string;
  year: number;
  artistId: string;
  image: FileList | string;
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
        if (data.image === null) {
          return alert("No file selected");
        }

        const newBlob =
          typeof data.image === "string"
            ? { url: data.image } // If it's a URL, just use it
            : data.image?.length > 0
            ? await uploadFile(data.image[0])
            : { url: album?.image }; // If no new file is uploaded, keep the existing image URL

        id
          ? await updateAlbum({
              id,
              data: {
                ...data,
                year: Number(data.year),
                image: newBlob.url,
              },
            })
          : await fetch("/api/albums", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...data,
                year: Number(data.year),
                image: newBlob.url,
              }),
            });
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
        render={({ field }) => (
          <FileUploader
            defaultImageUrl={album?.image || ""}
            label="Image"
            onFileUpload={(url) => field.onChange(url)}
            errorMessage={errors.image?.message}
          />
        )}
      />

      <div className="mt-4">
        <button
          type="submit"
          className="inline-block w-full rounded-lg bg-primary hover:bg-primary-500 transition px-5 py-3 font-medium text-white sm:w-auto"
        >
          {isSubmitting || isLoading ? <Spinner /> : t("Submit")}
        </button>
      </div>
    </form>
  );
}
