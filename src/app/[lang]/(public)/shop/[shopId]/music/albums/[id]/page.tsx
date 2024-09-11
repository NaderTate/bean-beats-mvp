import prisma from "@/lib/prisma";
import Songs from "../../songs";

type AlbumPageProps = {
  params: { id: string; shopId: string };
};

const AlbumPage = async ({ params: { id, shopId } }: AlbumPageProps) => {
  const songs = await prisma.songCoffeeShop.findMany({
    where: { AND: [{ coffeeShopId: shopId }, { song: { artistId: id } }] },
    include: { song: true },
  });

  return (
    <>
      <Songs songs={songs} />
    </>
  );
};

export default AlbumPage;
