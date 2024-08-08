"use client";

import Link from "next/link";
import { useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { useForm, Controller } from "react-hook-form";
import { Album, Artist, Song } from "@prisma/client";

import Input from "../Input";
import Select from "../Select";
import Spinner from "../spinner";

import { updateSong } from "@/actions/songs";

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

  const {
    register,
    handleSubmit,
    formState,
    watch,
    setValue,

    control,
  } = useForm<Inputs>({
    defaultValues: {
      artistId: song?.artistId || undefined,
      albumId: song?.albumId || undefined,
      title: song?.title,
      duration: song?.duration,
      price: song?.price,
    },
  });

  const { errors, isLoading, isSubmitting } = formState;

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

    const songFile = file?.[0]; // Check if file is defined
    const thumbnailImage = thumbnail?.[0]; // Check if thumbnail is defined

    const newSongBlob = songFile
      ? await upload(songFile.name, songFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })
      : { url: song?.fileURL };
    const newThumbnailBlob = thumbnailImage
      ? await upload(thumbnailImage.name, thumbnailImage, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })
      : { url: song?.thumbnail };

    if (id) {
      await updateSong({
        id,
        data: {
          artistId: otherData.artistId,
          albumId: otherData.albumId,
          title: otherData.title,
          duration: otherData.duration,
          price: otherData.price,
          fileURL: newSongBlob.url,
          thumbnail: newThumbnailBlob.url,
        },
      });
    } else {
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
    }

    onSubmit(); // Call onSubmit to close the modal
  };
  const albumOptions = albums.map((album) => ({
    value: album.id,
    title: album.name,
  }));

  const artistOptions = artists.map((artist) => ({
    value: artist.id,
    title: artist.name,
  }));

  console.log(errors);
  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <Controller
        name="artistId"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Select
            {...field}
            id="artist"
            label="Artist"
            options={artistOptions}
            errMessage={errors.artistId?.message}
          />
        )}
      />
      <Select
        errMessage={errors.albumId?.message}
        id="album"
        label="Album"
        options={albumOptions}
        {...register("albumId", {
          required: "This field is required",
        })}
      />

      <Input
        id="title"
        label="Title"
        placeholder="Title"
        errMessage={errors.title?.message}
        {...register("title", {
          required: "This field is required",
        })}
      />

      <Input
        id="price"
        label="Price"
        min={0}
        type="number"
        step={0.01}
        placeholder="Price"
        {...register("price", {
          valueAsNumber: true,

          required: "This field is required",
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
          {...register("file", {
            required: !song?.fileURL,
          })}
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
          {...register("thumbnail", { required: !song?.thumbnail })}
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
