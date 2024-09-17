import prisma from "@/lib/prisma";
import GenreMain from "./main";

type GenrePageProps = { params: { shopId: string; genreId: string } };

const GenrePage = async ({ params: { genreId, shopId } }: GenrePageProps) => {
  const genre = await prisma.genre.findUnique({
    where: {
      id: genreId,
    },
    include: { songs: true },
  });
  const SongCoffeeShop = await prisma.songCoffeeShop.findMany({
    where: {
      coffeeShopId: shopId,
    },
  });

  return <GenreMain genre={genre} SongCoffeeShop={SongCoffeeShop} />;
};

export default GenrePage;
