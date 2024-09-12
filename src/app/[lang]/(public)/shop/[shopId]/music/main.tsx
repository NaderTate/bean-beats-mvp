"use client";

import { useState } from "react";
import { Song } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import Songs from "./songs";
import Albums from "./albums";
import Artrists from "./artists";
import { useTranslations } from "next-intl";
import useGetLang from "@/hooks/use-get-lang";

type Props = {
  songs: {
    song: Song;
    price: number;
  }[];
  shopId: string;
  albums: ExtendedAlbum[];
  artists: { name: string; image: string; id: string }[];
};

type Section = "artists" | "songs" | "albums";
const MusicMain = ({ shopId, songs, albums, artists }: Props) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [currentSesction, setCurrentSection] = useState<Section>(
    (section as Section) || "artists"
  );

  const sectionsData = ["Artists", "Songs", "Albums"];
  const t = useTranslations();
  const { lang } = useGetLang();
  return (
    <div className="md:p-20 p-5 pt-20 ">
      <h3 className="font-semibold text-xl mb-5">{t("Music List")}</h3>
      <div>
        <input
          type="text"
          placeholder={t("Search")}
          className="w-full p-2 border border-gray-300 rounded-full"
        />
      </div>
      <div className="flex gap-x-5 my-10">
        {sectionsData.map((section) => (
          <button
            key={section}
            onClick={() => {
              setCurrentSection(section.toLowerCase() as Section);
              push(
                `/${lang}/shop/${shopId}/music?section=${section.toLowerCase()}`
              );
            }}
            className={`${
              currentSesction === section.toLocaleLowerCase()
                ? "bg-primary text-white"
                : "bg-gray-100"
            } p-2 rounded-full w-full px-5 md:w-fit transition-all font-medium`}
          >
            {t(section)}
          </button>
        ))}
      </div>
      {currentSesction === "songs" && <Songs songs={songs} />}
      {currentSesction === "albums" && (
        <Albums albums={albums} shopId={shopId} />
      )}
      {currentSesction === "artists" && (
        <Artrists artists={artists} shopId={shopId} />
      )}
    </div>
  );
};

export default MusicMain;
