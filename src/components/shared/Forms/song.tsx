"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { Album, Artist, Genre, Song } from "@prisma/client";

import Input from "../Input";
import Select from "../Select";
import SelectGenres from "../select-genres";

import { updateSong } from "@/actions/songs";
import FileUploader from "@/components/file-dropzone";
import Button from "@/components/button";

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

  const {
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

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    song ? song.genresIds : []
  );

  const submitHandler = async (data: any) => {
    const { file, thumbnail, ...otherData } = data;

    if (id) {
      await updateSong({
        id,
        data: {
          title: otherData.title,
          fileURL: file,
          albumId: otherData.albumId,
          artistId: otherData.artistId,
          duration: otherData.duration,
          thumbnail,
          genresIds: selectedGenres,
        },
      });
      toast.success(t("Song updated successfully"));
    } else {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...otherData,
          fileURL: file,
          thumbnail,
          genresIds: selectedGenres,
        }),
      });
      const data = await res.json();
      if (data.error) console.log(data);
      else {
        toast.success(t("Song created successfully"));
      }
    }
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

      <Controller
        control={control}
        name="title"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Input
            label={"Title"}
            placeholder="Title"
            defaultValue={song?.title || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.title?.message}
          />
        )}
      />

      <h2 className="mb-4">{t("Genres")}</h2>
      <SelectGenres
        genres={genres}
        handleCheckboxChange={setSelectedGenres}
        selectedGenreIds={song ? song.genresIds : []}
      />

      <Controller
        control={control}
        name="thumbnail"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <FileUploader
            defaultImageUrl={song?.thumbnail || ""}
            label="Thumbnail"
            onFileUpload={(url) => field.onChange(url)}
            errorMessage={errors.thumbnail?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="file"
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <FileUploader
            accept="audio/mpeg"
            defaultAudioUrl={song?.fileURL || ""}
            label="Song File"
            onFileUpload={(url, type, duration) => {
              field.onChange(url);
              setValue("duration", duration || 0);
            }}
            errorMessage={errors.file?.message}
          />
        )}
      />

      <Button className="mt-4" isLoading={isSubmitting || isLoading}>
        {t("Submit")}
      </Button>
    </form>
  );
};

export default SongForm;
