"use client";

import Table from "@/components/shared/table";

type Props = {
  artists: {
    id: string;
    name: string;
    _count: {
      Song: number;
    };
    image: string;
  }[];
  setOpen: () => void;
};

const ArtistsList = ({ artists, setOpen }: Props) => {
  return (
    <Table
      add={setOpen}
      data={artists.map((artist, i) => ({
        ...artist,
        number: i + 1,
        songsCount: artist._count.Song,
      }))}
      fields={{
        number: "#",
        name: "Artist",
        songsCount: "No. of songs",
        image: "Image",
      }}
    />
  );
};

export default ArtistsList;
