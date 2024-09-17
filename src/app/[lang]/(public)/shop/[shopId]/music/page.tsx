import prisma from "@/lib/prisma";
import MusicMain from "./main";

type Props = { params: { shopId: string } };

async function page({ params: { shopId } }: Props) {
  const shop = await prisma.coffeeShop.findUnique({
    where: { id: shopId },
    select: {
      SongCoffeeShop: {
        select: {
          song: true,
          price: true,
        },
      },
      Albums: {
        include: {
          artist: { select: { name: true } },
          _count: { select: { Song: true } },
        },
      },
      Artists: { select: { name: true, image: true, id: true } },
      Playlist: { include: { songs: { take: 1 } } },
    },
  });

  if (!shop) {
    return (
      <div>
        <h1>Shop not found</h1>
      </div>
    );
  }

  const genres = await prisma.genre.findMany({
    take: 10,
    orderBy: { id: "desc" },
  });

  return (
    <MusicMain
      playlists={shop.Playlist}
      genres={genres}
      shopId={shopId}
      albums={shop.Albums}
      artists={shop.Artists}
      songs={shop.SongCoffeeShop}
    />
  );
}

export default page;
