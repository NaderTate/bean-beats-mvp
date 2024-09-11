import Main from "./Main";
import prisma from "@/lib/prisma";

export default async function Page() {
  const songs = await prisma.song.findMany({ orderBy: { id: "desc" } });
  const albums = await prisma.album.findMany({ orderBy: { id: "desc" } });
  const artists = await prisma.artist.findMany({ orderBy: { id: "desc" } });
  const playlists = await prisma.playlist.findMany({ orderBy: { id: "desc" } });
  const genres = await prisma.genre.findMany({ orderBy: { id: "desc" } });
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
