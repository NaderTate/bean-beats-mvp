import prisma from "@/lib/prisma";
import GenreMain from "./main";

type GenrePageProps = { params: { shopId: string; genreId: string } };

const GenrePage = async ({ params: { genreId, shopId } }: GenrePageProps) => {
  const shop = await prisma.coffeeShop.findUnique({
    where: { id: shopId },
    select: {
      songPrice: true,
    },
  });

  const genre = await prisma.genre.findUnique({
    where: {
      id: genreId,
    },
    include: { songs: true },
  });


  return <GenreMain genre={genre}  songPrice={
    shop?.songPrice || 1
  }/>;
};

export default GenrePage;
