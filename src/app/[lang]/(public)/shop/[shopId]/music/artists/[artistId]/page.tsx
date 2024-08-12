import prisma from "@/lib/prisma";
import MainArtist from "./main";

type ArtistPageProps = { params: { artistId: string; shopId: string } };

const ArtistPage = async ({
  params: { artistId, shopId },
}: ArtistPageProps) => {
  const songs = await prisma.song.findMany({
    where: {
      SongCoffeeShop: { some: { coffeeShopId: shopId } },
      artistId,
    },
    include: { SongCoffeeShop: true },
  });

  const albums = await prisma.album.findMany({
    where: { coffeeShopsIds: { has: shopId }, artistId },
    include: {
      artist: { select: { name: true } },
      _count: { select: { Song: true } },
    },
  });

  return (
    <div className="mt-24 px-14">
      <MainArtist
        songs={songs.map((song, i) => ({
          song,
          price: song.SongCoffeeShop[i].price,
        }))}
        albums={albums}
      />
    </div>
  );
};

export default ArtistPage;
