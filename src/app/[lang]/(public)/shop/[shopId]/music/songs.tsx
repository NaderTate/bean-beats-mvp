import { Song } from "@prisma/client";

import SongCard from "./song-card";
import { useTranslations } from "next-intl";
import NotFound from "@/components/not-found";

type Props = {
  songs: Song[];
  songPrice: number;
  height?: height;
};

const Songs = ({ songs, height, songPrice }: Props) => {
  const t = useTranslations();
  if (songs.length === 0) {
    return <NotFound label="No songs found" height={height} />;
  }
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} price={songPrice} />
      ))}
    </div>
  );
};

export default Songs;
