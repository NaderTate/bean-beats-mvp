"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";

import Spinner from "../spinner";
import { Artist } from "@prisma/client";
import Select from "../Select";

interface AlbumFormProps {
  onSubmit: () => void;
  artists: Artist[];
}

type Inputs = {
  name: string;
  year: number;
  artistId: string;
};

export default function AlbumForm({ onSubmit, artists }: AlbumFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isLoading, isSubmitting },
  } = useForm<Inputs>();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const artistOptions = artists.map((artist) => ({
    value: artist.id,
    title: artist.name,
  }));
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

        await fetch("/api/albums", {
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
      <div>
        <label className="sr-only" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full rounded-lg border-gray-200 p-3 text-sm focus:outline-none focus:border-primary/50 border  dark:border-gray-600 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-400"
        />
      </div>
      <div>
        <label className="sr-only" htmlFor="name">
          Year
        </label>
        <input
          id="name"
          type="text"
          placeholder="Year"
          {...register("year")}
          className="w-full rounded-lg border-gray-200 p-3 text-sm focus:outline-none focus:border-primary/50 border  dark:border-gray-600 dark:placeholder-gray-400 dark:bg-gray-700 dark:text-gray-400"
        />
      </div>
      <Select
        id="artist"
        label="Artist"
        options={artistOptions}
        {...register("artistId")}
      />
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
          className="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
        >
          {isSubmitting || isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    </form>
  );
}
