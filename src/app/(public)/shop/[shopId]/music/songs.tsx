import { Song } from "@prisma/client";

import SongCard from "./song-card";

type Props = { songs: Song[] };

const Songs = ({ songs }: Props) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
};

export default Songs;
