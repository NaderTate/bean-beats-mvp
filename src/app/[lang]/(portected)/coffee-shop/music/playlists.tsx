"use client";

import { deletePlaylist } from "@/actions/playlists";
import PlaylistForm from "@/components/shared/Forms/playlist";
import Table from "@/components/shared/table";
import { Song } from "@prisma/client";

type Props = {
  playlists: {
    id: string;
    name: string;
    _count: {
      songs: number;
    };
    shopId: string | null;
    songsIds: string[];
  }[];
  setOpen: () => void;
  allSongs: Song[];
  onSubmit: () => void;
};

const Playlists = ({ playlists, setOpen, allSongs, onSubmit }: Props) => {
  return (
    <Table
      editForm={<PlaylistForm allSongs={allSongs} onSubmit={onSubmit} />}
      add={setOpen}
      deleteFn={deletePlaylist}
      data={playlists.map((playlists, i) => ({
        id: playlists.id,
        number: i + 1,
        name: playlists.name,
        songs: playlists._count.songs,
        songsIds: playlists.songsIds,
      }))}
      fields={{
        number: "#",
        name: "Name",
        songs: "No. of songs",
      }}
    />
  );
};

export default Playlists;
