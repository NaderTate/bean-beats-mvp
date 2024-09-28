import { Genre, Song, SongCoffeeShop } from "@prisma/client";
import { useTranslations } from "next-intl";
import React from "react";
import SongCard from "../../song-card";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

type Props = {
  genre: ({ songs: Song[] } & Genre) | null;
  songPrice: number;
};

const GenreMain = ({ genre, songPrice }: Props) => {
  const t = useTranslations();

  if (!genre) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Image
          src="/images/not-found.svg"
          width={200}
          height={200}
          alt="not-found"
        />
        <h1>{t("No artists found")}</h1>
      </div>
    );
  }
  return (
    <div className="mt-24 px-14">
      <Image
        src={genre.image}
        className="w-full h-72 object-cover rounded-lg"
        width={2000}
        height={1000}
        alt={genre.name}
      />
      <div className="flex justify-between">
        <h1 className="text-xl text-primary font-bold mt-4">{genre.name}</h1>
        <p className="text-lg mt-4">
          <FaMusic className="inline-block mr-2 text-primary" />
          {genre.songs.length} {genre.songs.length === 1 ? "track" : "tracks"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {genre.songs.map((song) => (
          <SongCard price={songPrice} key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default GenreMain;
