"use client";

import { Song } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = { song: Song & { artist: { name: string } | null } };

const SongCard = ({ song }: Props) => {
  const t = useTranslations();
  return (
    <>
      <div className="rounded-lg shadow-xl w-full bg-[#FAFAFA]">
        <h1 className="text-2xl font-semibold mt-5">
          {t("Current playing song")}
        </h1>

        <Image
          src={song.thumbnail}
          alt={song.title}
          width={2000}
          height={2000}
          className="rounded-t-lg w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-primary">{song.title}</h3>
          <p className="text-gray-500">{song.artist?.name}</p>
        </div>
      </div>
      <h1 className="text-2xl font-semibold -mb-10 mt-10">
        {t("Music Queue")}
      </h1>
    </>
  );
};

export default SongCard;
