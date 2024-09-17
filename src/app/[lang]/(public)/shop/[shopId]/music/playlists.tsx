import { Playlist, Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  playlists: ({
    songs: Song[];
  } & Playlist)[];
  shopId: string;
  lang: string;
};

const Playlists = ({ playlists, lang, shopId }: Props) => {
  return (
    <div>
      {playlists.map((playlist) => {
        if (playlist.songs.length === 0) {
          return null;
        }
        return (
          <div key={playlist.id} className="flex flex-wrap">
            <Link
              href={`/${lang}/shop/${shopId}/music/playlists/${playlist.id}`}
              className="mb-5 bg-gray-100 rounded-lg p-2 w-full sm:w-72"
            >
              <Image
                width={300}
                height={300}
                alt={playlist.name}
                className="rounded-lg"
                src={playlist.songs[0].thumbnail}
              />
              <h3 className="font-semibold text-xl mt-1 mb-2 text-primary">
                {playlist.name}
              </h3>
              <span className="text-gray-600">
                {playlist.songs.length} songs
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Playlists;
