"use client";

import { deleteCoffeeShopSong } from "@/actions/songs";
import Table from "@/components/shared/table";

type Props = {
  playlists: {
    id: string;
    name: string;
    _count: {
      songs: number;
    };
  }[];
  setOpen: () => void;
};

const Playlists = ({ playlists, setOpen }: Props) => {
  return (
    <Table
      add={setOpen}
      deleteFn={deleteCoffeeShopSong}
      data={playlists.map((playlists, i) => ({
        id: playlists.id,
        number: i + 1,
        name: playlists.name,
        songs: playlists._count,
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
