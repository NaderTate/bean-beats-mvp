"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";

import Spinner from "../spinner";
import { Album, Artist } from "@prisma/client";
import Select from "../Select";
import { updateAlbum } from "@/actions/albums";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Input from "../Input";
import { uploadFile } from "@/utils/upload-files";

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
      <Input
        id="name"
        label={t("Name")}
        placeholder={t("Name")}
        errMessage={errors.name?.message}
        {...register("name", {
          required: "This field is required",
        })}
      />

      <Input
        id="year"
        label={t("Year")}
        placeholder={t("Year")}
        errMessage={errors.year?.message}
        {...register("year", {
          required: "This field is required",
        })}
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
      <div>
        <label
          htmlFor="file_input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {t("Upload Image")}
        </label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          {...register("image", {
            required: !id && "This field is required", // Only required if creating a new album
            validate: (value) =>
              typeof value === "string" ||
              value?.length > 0 ||
              "This field is required", // Checks if the value is a string (URL) or a file is uploaded
          })}
        />
        {!!errors.image && (
          <span className="text-red-500 text-sm">{errors.image.message}</span>
        )}

        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {!!id
            ? t("Leave empty to keep the same image")
            : t("Upload a song thumbnail")}
          {album?.image && (
            <Link
              target="_blank"
              href={album?.image}
              className="text-blue-500 hover:underline"
            >
              ( {t("View thumbnail")} )
            </Link>
          )}
        </p>
      </div>

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
