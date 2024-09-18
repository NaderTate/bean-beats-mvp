"use client";

import { useState, useMemo } from "react";
import { Genre, Playlist, Song } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import Songs from "./songs";
import Albums from "./albums";
import Artists from "./artists";
import { useTranslations } from "next-intl";
import useGetLang from "@/hooks/use-get-lang";
import Genres from "./genres";
import Playlists from "./playlists";
import Input from "@/components/shared/Input";

type Props = {
  songs: {
    song: Song;
    price: number;
  }[];
  shopId: string;
  albums: ExtendedAlbum[];
  artists: { name: string; image: string; id: string }[];
  genres: Genre[];
  playlists: ({
    songs: Song[];
  } & Playlist)[];
};

type Section = "artists" | "songs" | "albums" | "playlists";

const MusicMain = ({
  shopId,
  songs,
  albums,
  artists,
  genres,
  playlists,
}: Props) => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [currentSection, setCurrentSection] = useState<Section>(
    (section as Section) || "artists"
  );

  const [searchQuery, setSearchQuery] = useState("");

  const sectionsData = ["Artists", "Songs", "Albums", "Playlists"];
  const t = useTranslations();
  const { lang } = useGetLang();

  // Filtered data based on the current section and search query
  const filteredSongs = useMemo(() => {
    if (currentSection !== "songs") return songs;
    return songs.filter((songData) =>
      songData.song.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [songs, searchQuery, currentSection]);

  const filteredAlbums = useMemo(() => {
    if (currentSection !== "albums") return albums;
    return albums.filter((album) =>
      album.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [albums, searchQuery, currentSection]);

  const filteredArtists = useMemo(() => {
    if (currentSection !== "artists") return artists;
    return artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [artists, searchQuery, currentSection]);

  const filteredPlaylists = useMemo(() => {
    if (currentSection !== "playlists") return playlists;
    return playlists.filter((playlist) =>
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [playlists, searchQuery, currentSection]);

  return (
    <div className="md:p-20 p-5 pt-20 ">
      <h3 className="font-semibold text-xl mt-5 mb-3">{t("Music List")}</h3>

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
              currentSection === section.toLocaleLowerCase()
                ? "bg-primary text-white"
                : "bg-gray-100"
            } p-2 rounded-full w-full px-5 md:w-fit transition-all font-medium`}
          >
            {t(section)}
          </button>
        ))}
      </div>
      <Input
        type="text"
        label={`${t(`Search ${currentSection}`)} `}
        className="max-w-md mb-3"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {currentSection === "songs" && (
        <Songs songs={filteredSongs} height="sm" />
      )}
      {currentSection === "albums" && (
        <Albums albums={filteredAlbums} shopId={shopId} height="sm" />
      )}
      {currentSection === "artists" && (
        <Artists artists={filteredArtists} shopId={shopId} height="sm" />
      )}
      {currentSection === "playlists" && (
        <Playlists
          playlists={filteredPlaylists}
          lang={lang}
          shopId={shopId}
          height="sm"
        />
      )}
      <Genres genres={genres} shopId={shopId} lang={lang} />
    </div>
  );
};

export default MusicMain;
