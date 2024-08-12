import ArtistMain from "./main";
import prisma from "@/lib/prisma";

type ArtistPageProps = { params: { id: string } };

const ArtistPage = async ({ params: { id } }: ArtistPageProps) => {
  const artist = await prisma.artist.findUnique({
    where: { id },
    include: {
      Song: { include: { SongCoffeeShop: true } },
      Album: {
        include: {
          artist: { select: { name: true } },
          _count: { select: { Song: true } },
        },
      },
    },
  });

  if (!artist) {
    return (
      <div>
        <h1>Artist not found</h1>
      </div>
    );
  }

  return (
    <>
      <ArtistMain
        albums={artist.Album}
        songs={artist.Song.map((song, i) => ({
          song,
          price: song.SongCoffeeShop[i].price,
        }))}
      />
    </>
  );
};

export default ArtistPage;
