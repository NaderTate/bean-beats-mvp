"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";
import { Artist } from "@prisma/client";

import Spinner from "../spinner";

import { updateArtist } from "@/actions/artists";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Input from "../Input";
import { uploadFile } from "@/utils/upload-files";

type Inputs = {
  name: string;
  image: FileList | string;
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
        if (data.image === null) {
          return alert("No file selected");
        }

        const newBlob =
          typeof data.image === "string"
            ? { url: data.image } // If it's a URL, just use it
            : data.image?.length > 0
            ? await uploadFile(data.image[0])
            : { url: artist?.image }; // If no new file is uploaded, keep the existing image URL

        id
          ? await updateArtist({
              id,
              data: {
                ...data,
                image: newBlob.url,
              },
            })
          : await fetch("/api/artists", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...data, image: newBlob.url }),
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

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          {t("Upload Image")}
        </label>
        <input
          type="file"
          id="file_input"
          accept="image/*"
          {...register("image", {
            required: !id && "This field is required", // Only required if creating a new album
            validate: (value) =>
              typeof value === "string" ||
              value?.length > 0 ||
              "This field is required", // Checks if the value is a string (URL) or a file is uploaded
          })}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
          {artist?.image && (
            <Link
              target="_blank"
              href={artist?.image}
              className="text-blue-500 hover:underline"
            >
              ( {t("View image")} )
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
