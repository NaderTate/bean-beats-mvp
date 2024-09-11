import prisma from "@/lib/prisma";
import MainArtist from "./main";

type ArtistPageProps = { params: { shopId: string; artistId: string } };

const ArtistPage = async ({
  params: { artistId, shopId },
}: ArtistPageProps) => {
  console.log({ artistId, shopId });
  // const songs = await prisma.song.findMany({
  //   where: {
  //     AND: [
  //       { SongCoffeeShop: { } },
  //       { artistId },
  //     ],
  //   },
  //   include: { SongCoffeeShop: true },
  // });
  const songs = await prisma.songCoffeeShop.findMany({
    where: { AND: [{ coffeeShopId: shopId }, { song: { artistId } }] },
    include: { song: true },
  });

  const albums = await prisma.album.findMany({
    where: { AND: [{ coffeeShopsIds: { has: shopId } }, { artistId }] },
    include: {
      artist: { select: { name: true } },
      _count: { select: { Song: true } },
    },
  });

  return (
    <div className="mt-24 px-14">
      <MainArtist shopId={shopId} songs={songs} albums={albums} />
    </div>
  );
};

export default ArtistPage;
