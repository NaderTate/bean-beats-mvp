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
      }}
      actions={[
        {
          title: "Edit",
          cb: (id: string) => console.log("Edit", id),
        },
        {
          title: "Delete",
          cb: (id: string) => console.log("Delete", id),
        },
      ]}
    />
  );
};

export default ArtistsList;
