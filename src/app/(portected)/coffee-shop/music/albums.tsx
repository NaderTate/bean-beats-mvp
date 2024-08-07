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

export default Albums;
