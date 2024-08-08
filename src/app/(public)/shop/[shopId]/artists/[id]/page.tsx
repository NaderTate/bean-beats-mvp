import { NextPage } from "next";
import ArtistMain from "./main";
import { Album, Song } from "@prisma/client";

type ArtistPageProps = { songs: Song[]; albums: Album[] };

const ArtistPage = async ({ songs, albums }: ArtistPageProps) => {
  return (
    <>
      <ArtistMain songs={songs} albums={albums} />
    </>
  );
};

export default ArtistPage;
