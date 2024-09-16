import { Song } from "@prisma/client";

import SongCard from "./song-card";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  songs: {
    song: Song;
    price: number | string;
  }[];
};

const Songs = ({ songs }: Props) => {
  const t = useTranslations();
  if (songs.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Image
          src="/images/not-found.svg"
          width={200}
          height={200}
          alt="not-found"
        />
        <h1>{t("No songs found")}</h1>
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
