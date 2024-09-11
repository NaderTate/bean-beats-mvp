import ArtistMain from "./main";
import prisma from "@/lib/prisma";

type ArtistPageProps = { params: { id: string; shopId: string } };

const ArtistPage = async ({ params: { id, shopId } }: ArtistPageProps) => {
  const songs = await prisma.songCoffeeShop.findMany({
    where: { AND: [{ coffeeShopId: shopId }, { song: { artistId: id } }] },
    include: { song: true },
  });

  const albums = await prisma.album.findMany({
    where: { AND: [{ coffeeShopsIds: { has: shopId } }, { artistId: id }] },
    include: {
      artist: { select: { name: true } },
      _count: { select: { Song: true } },
    },
  });

  return (
    <>
      <ArtistMain albums={albums} songs={songs} shopId={shopId} />
    </>
  );
};

export default ArtistPage;
