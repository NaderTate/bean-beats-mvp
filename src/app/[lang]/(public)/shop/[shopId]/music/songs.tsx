import { Song } from "@prisma/client";

import SongCard from "./song-card";

type Props = {
  songs: {
    song: Song;
    price: number | string;
  }[];
};

const Songs = ({ songs }: Props) => {
  if (songs.length === 0) {
    return (
      <div className="mt-24">
        <h1>No songs found</h1>
      </div>
    );
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {songs.map((song) => (
        <SongCard
          key={song.song.id}
          song={{
            ...song.song,
            price: song.price,
          }}
        />
      ))}
    </div>
  );
};

export default Songs;
