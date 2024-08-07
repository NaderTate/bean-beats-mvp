"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";
import Spinner from "../spinner";
import { Artist } from "@prisma/client";

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

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (!inputFileRef.current?.files) {
          return alert("No file selected");
        }

        const file = inputFileRef.current.files[0];
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });

        await fetch("/api/artists", {
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
          Name
        </label>
        <input
          className="w-full rounded-lg border-gray-200 p-3 text-sm focus:outline-none focus:border-primary/50 border  dark:border-gray-600 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-400"
          placeholder="Name"
          type="text"
          id="name"
          {...register("name")}
        />
      </div>

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload Image
        </label>
        <input
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          ref={inputFileRef}
          type="file"
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
          {isSubmitting || isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    </form>
  );
}
