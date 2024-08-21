"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";
import { Artist } from "@prisma/client";

import Spinner from "../spinner";

import { updateArtist } from "@/actions/artists";
import { useTranslations } from "next-intl";

type Inputs = {
  name: string;
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
    formState: { isLoading, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: artist?.name,
    },
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  const t = useTranslations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (!inputFileRef.current?.files) {
          return alert("No file selected");
        }

        const file = inputFileRef.current.files?.[0];
        const newBlob = file
          ? await upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/api/upload",
            })
          : { url: artist?.image };
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
      <div>
        <label className="sr-only" htmlFor="name">
          {t("Name")}
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          placeholder={t("Name")}
          className="w-full rounded-lg border-gray-200 p-3 text-sm focus:outline-none focus:border-primary/50 border  dark:border-gray-600 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-400"
        />
      </div>

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
          ref={inputFileRef}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          SVG, PNG, JPG or GIF (MAX. 800x400px).
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
