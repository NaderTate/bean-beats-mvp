import ArtistMain from "./main";
import prisma from "@/lib/prisma";

type ArtistPageProps = { params: { id: string; shopId: string } };

const ArtistPage = async ({ params: { id, shopId } }: ArtistPageProps) => {
  const shop = await prisma.coffeeShop.findUnique({
    where: { id: shopId },
    select: {
      songPrice: true,
    },
  });

  const songs = await prisma.song.findMany({
    where: { artistId: id },
  });

  const albums = await prisma.album.findMany({
    where: { AND: [{ coffeeShopsIds: { has: shopId } }, { artistId: id }] },
    include: {
      Song: true,
      artist: { select: { name: true } },
      _count: { select: { Song: true } },
    },
  });

  return (
    <>
      <ArtistMain
        albums={albums}
        songs={songs}
        shopId={shopId}
        songPrice={shop?.songPrice || 1}
      />
    </>
  );
};

export default ArtistPage;
