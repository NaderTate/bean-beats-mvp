"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useForm, Controller } from "react-hook-form";
import { Album, Artist, Genre, Song } from "@prisma/client";

import Input from "../Input";
import Select from "../Select";
import Spinner from "../spinner";

import { updateSong } from "@/actions/songs";
import SelectGenres from "../select-genres";
import { useTranslations } from "next-intl";

type Props = {
  albums: Album[];
  artists: Artist[];
  genres: Genre[];
  itemToEdit?: Song;
  onSubmit: () => void;
};

type Inputs = {
  file: string;
  title: string;
  albumId: string;
  duration: number;
  artistId: string;
  thumbnail: string;
};

const SongForm = ({
  albums,
  genres,
  onSubmit,
  artists: artists,
  itemToEdit: song,
}: Props) => {
  const id = song?.id;
  const isEditSession = !!id;

  const {
    watch,
    setValue,
    register,
    formState,
    handleSubmit,

    control,
  } = useForm<Inputs>({
    defaultValues: {
      title: song?.title,
      duration: song?.duration,
      albumId: song?.albumId || undefined,
      artistId: song?.artistId || undefined,
    },
  });

  const { errors, isLoading, isSubmitting } = formState;

  const file: any = watch("file")?.[0];
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    song ? song.genresIds : []
  );

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
          title: otherData.title,
          fileURL: newSongBlob.url,
          albumId: otherData.albumId,
          artistId: otherData.artistId,
          duration: otherData.duration,
          thumbnail: newThumbnailBlob.url,
          genresIds: selectedGenres,
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
          genresIds: selectedGenres,
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

  const t = useTranslations();

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
      <h2 className="mb-4">{t("Genres")}</h2>
      <SelectGenres
        genres={genres}
        handleCheckboxChange={setSelectedGenres}
        selectedGenreIds={song ? song.genresIds : []}
      />
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          {t("Upload a song file")}
        </label>

        <div className="block p-2 w-full">
          <label
            htmlFor="file_input"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Select song file
          </label>
          <input
            placeholder="Upload a song file"
            type="file"
            id="file_input"
            accept="audio/mpeg"
            className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            {...register("file", {
              required: !song?.fileURL,
            })}
          />
        </div>
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {isEditSession
            ? t("Leave empty to keep the same file")
            : t("Upload a song file")}
          {song?.fileURL && (
            <Link
              className="text-blue-500 hover:underline"
              href={song?.fileURL}
              target="_blank"
            >
              ( {t("Open Song")} )
            </Link>
          )}
        </p>
      </div>

      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="file_input"
        >
          {t("Upload song poster")}
        </label>
        <input
          className="block p-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          accept="image/*"
          {...register("thumbnail", { required: !song?.thumbnail })}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
          id="file_input_help"
        >
          {isEditSession
            ? t("Leave empty to keep the same image")
            : t("Upload a song thumbnail")}
          {song?.thumbnail && (
            <Link
              className="text-blue-500 hover:underline"
              href={song?.thumbnail}
              target="_blank"
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
};

export default SongForm;
