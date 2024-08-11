import { Song } from "@prisma/client";

import SongCard from "./song-card";

type Props = {
  songs: {
    song: Song;
    price: number;
  }[];
};

const Songs = ({ songs }: Props) => {
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
