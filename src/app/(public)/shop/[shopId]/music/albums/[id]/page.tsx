import prisma from "@/lib/prisma";

type AlbumPageProps = {
  params: { id: string; shopId: string };
};

const AlbumPage = async ({ params: { id, shopId } }: AlbumPageProps) => {
  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      Song: {
        where: {
          coffeeShopsIds: { has: shopId },
        },
      },
    },
  });

  return <>AlbumPage</>;
};

export default AlbumPage;
