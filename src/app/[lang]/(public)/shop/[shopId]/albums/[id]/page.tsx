import prisma from "@/lib/prisma";
import Songs from "../../music/songs";

type AlbumPageProps = {
  params: { id: string; shopId: string };
};

const AlbumPage = async ({ params: { id, shopId } }: AlbumPageProps) => {
  const shop = await prisma.coffeeShop.findUnique({
    where: { id: shopId },
    select: {
      songPrice: true,
    },
  });

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      Song: true,
    },
  });
  return (
    <>
      <Songs songs={album?.Song || []} songPrice={shop?.songPrice || 1} />
    </>
  );
};

export default AlbumPage;
