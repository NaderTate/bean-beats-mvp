"use client";

import Table from "@/components/shared/table";
import { Song } from "@prisma/client";

type Props = {
  songs: (Song & { artist: { name: string; image: string } | null })[];
};

const SongsList = ({ songs }: Props) => {
  return (
    <div>
      <Table
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
    </div>
  );
};

export default SongsList;
