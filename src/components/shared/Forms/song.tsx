import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { upload } from "@vercel/blob/client";
import { Album, Artist, Song } from "@prisma/client";

import Input from "../Input";
import Select from "../Select";
import Spinner from "../spinner";
import Link from "next/link";

type Props = {
  albums: Album[];
  artists: Artist[];
  itemToEdit?: Song;
  onSubmit: () => void;
};

type Inputs = {
  file: string;
  title: string;
  price: number;
  albumId: string;
  duration: number;
  artistId: string;
  thumbnail: string;
};

const SongForm = ({
  albums,
  itemToEdit: song,
  artists: artists,
  onSubmit,
}: Props) => {
  const id = song?.id;
  const isEditSession = !!id;

  const { register, handleSubmit, formState, watch, setValue } =
    useForm<Inputs>({
      defaultValues: {
        artistId: song?.artistId || "",
        albumId: song?.albumId || "",
        title: song?.title,
        duration: song?.duration,
        price: song?.price,
      },
    });

  const { isLoading, isSubmitting } = formState;

  const file: any = watch("file")?.[0];

  useEffect(() => {
    if (file) {
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener("loadedmetadata", () => {
        setValue("duration", audio.duration);
      });
    }
  }, [file, setValue]);

  const submitHandler = async (data: any) => {
    const { file, thumbnail, ...otherData } = data;

    const songFile = file[0];
    const thumbnailImage = thumbnail[0];

    const newSongBlob = await upload(songFile.name, songFile, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
    const newThumbnailBlob = await upload(thumbnailImage.name, thumbnailImage, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });

    await fetch("/api/songs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...otherData,
        fileURL: newSongBlob.url,
        thumbnail: newThumbnailBlob.url,
      }),
    });

    onSubmit();
  };

  const albumOptions = albums.map((album) => ({
    value: album.id,
    title: album.name,
  }));

  const artistOptions = artists.map((artist) => ({
    value: artist.id,
    title: artist.name,
  }));

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <Select
        id="artist"
        label="Artist"
        options={artistOptions}
        {...register("artistId")}
      />

      <Select
        id="album"
        label="Album"
        options={albumOptions}
        {...register("albumId")}
      />

      <Input
        id="title"
        label="Title"
        placeholder="Title"
        {...register("title")}
      />

      {/* <Input
        id="duration"
        type="number"
        label="Duration"
        placeholder="Duration"
        {...register("duration", {
          valueAsNumber: true,
        })}
      /> */}

      <Input
        id="price"
        label="Price"
        min={0}
        type="number"
        step={0.01}
        placeholder="Price"
        {...register("price", {
          valueAsNumber: true,
        })}
      />

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload Song
        </label>
        <input
          className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          {...register("file")}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {isEditSession
            ? "Leave empty to keep the same file "
            : "Upload a song file "}
          {song?.fileURL && (
            <Link
              className="text-blue-500 hover:underline"
              href={song?.fileURL}
              target="_blank"
            >
              ( Open Song )
            </Link>
          )}
        </p>
      </div>
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          Upload song poster
        </label>
        <input
          className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          {...register("thumbnail")}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {isEditSession
            ? "Leave empty to keep the same image "
            : "Upload a song thumbnail "}
          {song?.thumbnail && (
            <Link
              className="text-blue-500 hover:underline"
              href={song?.thumbnail}
              target="_blank"
            >
              ( View thumbnail )
            </Link>
          )}
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
};

export default SongForm;
