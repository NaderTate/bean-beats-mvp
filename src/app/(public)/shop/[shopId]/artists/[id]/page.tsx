import ArtistMain from "./main";
import prisma from "@/lib/prisma";

type ArtistPageProps = { params: { id: string } };

const ArtistPage = async ({ params: { id } }: ArtistPageProps) => {
  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      Song: true,
      Album: {
        include: {
          artist: { select: { name: true } },
          _count: { select: { Song: true } },
        },
      },
    },
  });

  if (!artist) {
    return {
      notFound: true,
    };
  }

  return (
    <>
      <ArtistMain albums={artist.Album} songs={artist.Song} />
    </>
  );
};

export default ArtistPage;
