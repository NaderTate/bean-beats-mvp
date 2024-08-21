import { Playlist, Song } from "@prisma/client";
import { useForm } from "react-hook-form";
import Spinner from "../spinner";
import { createPlaylist, updatePlaylist } from "@/actions/playlists";
import SelectSongs from "../select-songs";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "../Input";

interface PlaylistFormProps {
  onSubmit: () => void;
  allSongs: Song[];
  itemToEdit?: Playlist;
}

type Inputs = {
  name: string;
};

function PlaylistForm({
  onSubmit,
  itemToEdit: playlist,
  allSongs,
}: PlaylistFormProps) {
  const id = playlist?.id;
  const {
    register,
    handleSubmit,
    formState: { isLoading, isSubmitting, errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: playlist?.name,
    },
  });

  const [selectedSongs, setSelectedSongs] = useState<string[]>(
    playlist ? playlist.songsIds : []
  );

  const t = useTranslations();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        id
          ? await updatePlaylist({
              id,
              data: {
                ...data,
                songsIds: selectedSongs,
              },
            })
          : await createPlaylist({
              data: {
                ...data,
                songsIds: selectedSongs,
              },
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
      <SelectSongs
        songs={allSongs}
        handleCheckboxChange={setSelectedSongs}
        selectedSongIds={playlist ? playlist.songsIds : []}
      />

      <div className="mt-4">
        <button
          type="submit"
          className="aboslute bottom-0 inline-block w-full rounded-lg bg-primary hover:bg-primary-500 transition px-5 py-3 font-medium text-white sm:w-auto"
        >
          {isSubmitting || isLoading ? <Spinner /> : t("Submit")}
        </button>
      </div>
    </form>
  );
}

export default PlaylistForm;
