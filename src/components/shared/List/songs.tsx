import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Song = {
  title: string;
  singer: string;
  image: string;
  price: string;
};

export default function SongsList({
  topSongs,
}: Readonly<{
  topSongs: {
    artist: {
      name: string;
    } | null;
    title: string;
    thumbnail: string;
  }[];
}>) {
  const t = useTranslations();
  return (
    <div className=" col-span-1 flex flex-col gap-2 p-2 md:p-4 justify-between bg-white border-gray-200 border md:col-span-1 lg:col-span-3 rounded-xl shadow-md">
      <div className="flex justify-center items-center">
        <h2 className="text-sm font-semibold text-gray-600">
          {t("Top Songs")}
        </h2>
      </div>
      {topSongs.map((song) => (
        <div
          key={song.title + "section2"}
          className="flex gap-2 border border-gray-200 rounded-xl shadow-sm h-16"
        >
          <div className="flex items-center justify-center p-1">
            <Image
              src={song.thumbnail}
              alt={song.title}
              width={60}
              height={60}
              className="rounded-full object-cover aspect-square"
            />
          </div>
          <div className="flex flex-col justify-center items-center flex-1  rounded-b-xl px-2">
            <div className="flex justify-between items-center w-full">
              <p className="text-sm font-semibold text-gray-700">
                {song.title}
              </p>
            </div>
            <div className="flex flex-wrap w-full ">
              <p className="text-xs font-semibold text-gray-500">
                {song.artist?.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
