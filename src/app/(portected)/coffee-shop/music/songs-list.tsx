"use client";

import Table from "@/components/shared/table";

type Props = {
  songs: {
    id: string;
    artist: {
      name: string;
      image: string;
    } | null;
    title: string;
    price: number;
    thumbnail: string;
  }[];
  setOpen: () => void;
};

const SongsList = ({ songs, setOpen }: Props) => {
  return (
    <Table
      add={setOpen}
      data={songs.map((song, i) => ({
        ...song,
        number: i + 1,
        artistName: song.artist?.name,
        artistImage: song.artist?.image,
      }))}
      fields={{
        number: "#",
        title: "Song Name",
        artistName: "Artist",
        price: "Price",
      }}
    />
  );
};

export default SongsList;
