"use client";

import { Song } from "@prisma/client";

import Table from "@/components/shared/table";
import { deletePlaylist } from "@/actions/playlists";
import PlaylistForm from "@/components/shared/Forms/playlist";

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
      addBtnLabel="Add New Playlist"
      editForm={<PlaylistForm allSongs={allSongs} onSubmit={onSubmit} />}
      add={setOpen}
      deleteFn={deletePlaylist}
      data={playlists.map((playlists, i) => ({
        id: playlists.id,
        number: i + 1,
        name: playlists.name,
        songs: playlists.songsIds.length,
        songsIds: playlists.songsIds,
      }))}
      fields={{
        number: "#",
        name: "Name",
        songs: "No of songs",
      }}
    />
  );
};

export default Playlists;
