import Main from "./Main";
import prisma from "@/lib/prisma";

const GetSongsArtistsAlbums = async () => {
  const songs = await prisma.song.findMany();
  const albums = await prisma.album.findMany();
  const artists = await prisma.artist.findMany();
  return { songs, albums, artists };
};

export default async function Page() {
  const { songs, albums, artists } = await GetSongsArtistsAlbums();
  return <Main artists={artists} albums={albums} songs={songs} />;
}
