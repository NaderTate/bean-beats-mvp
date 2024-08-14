import Main from "./Main";
import prisma from "@/lib/prisma";

export default async function Page() {
  const songs = await prisma.song.findMany();
  const albums = await prisma.album.findMany();
  const artists = await prisma.artist.findMany();
  const playlists = await prisma.playlist.findMany();
  const genres = await prisma.genre.findMany();
  return (
    <Main
      songs={songs}
      albums={albums}
      genres={genres}
      artists={artists}
      playlists={playlists}
    />
  );
}
