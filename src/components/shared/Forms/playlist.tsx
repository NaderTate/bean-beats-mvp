import { Playlist, Song } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { createPlaylist, updatePlaylist } from "@/actions/playlists";
import SelectSongs from "../select-songs";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "../Input";
import Button from "@/components/button";
import toast from "react-hot-toast";

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
    control,

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
        if (id) {
          await updatePlaylist({
            id,
            data: {
              ...data,
              songsIds: selectedSongs,
            },
          });
          toast.success(t("Playlist updated successfully"));
        } else {
          await createPlaylist({
            data: {
              ...data,
              songsIds: selectedSongs,
            },
          });
          toast.success(t("Playlist created successfully"));
        }

        onSubmit();
      })}
      className="space-y-4"
    >
      <Controller
        name="name"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <Input
            label={"Name"}
            placeholder="Name"
            defaultValue={playlist?.name || ""}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            errMessage={errors.name?.message}
          />
        )}
      />

      <SelectSongs
        songs={allSongs}
        handleCheckboxChange={setSelectedSongs}
        selectedSongIds={playlist ? playlist.songsIds : []}
      />
      <Button className="mt-4" isLoading={isSubmitting || isLoading}>
        {t("Submit")}
      </Button>
    </form>
  );
}

export default PlaylistForm;
