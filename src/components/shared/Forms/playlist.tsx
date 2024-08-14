import { Playlist, Song } from "@prisma/client";
import { useForm } from "react-hook-form";
import Spinner from "../spinner";
import { createPlaylist, updatePlaylist } from "@/actions/playlists";
import SelectSongs from "../select-songs";
import { useState } from "react";

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
    formState: { isLoading, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: playlist?.name,
    },
  });

  const [selectedSongs, setSelectedSongs] = useState<string[]>(
    playlist ? playlist.songsIds : []
  );
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
          {isSubmitting || isLoading ? <Spinner /> : "Submit"}
        </button>
      </div>
    </form>
  );
}

export default PlaylistForm;
