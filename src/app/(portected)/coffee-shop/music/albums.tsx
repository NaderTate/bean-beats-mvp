"use client";

import Table from "@/components/shared/table";

type Props = {
  albums: {
    artist: {
      name: string;
    };
    name: string;
    _count: {
      Song: number;
    };
    image: string;
    id: string;
  }[];
  setOpen: () => void;
};

const Albums = ({ albums, setOpen }: Props) => {
  return (
    <Table
      add={setOpen}
      data={albums.map((album, i) => ({
        ...album,
        number: i + 1,
        songsCount: album._count.Song,
      }))}
      fields={{
        number: "#",
        name: "Name",
        songsCount: "No. of songs",
      }}
    />
  );
};

export default Albums;
