import prisma from "@/lib/prisma";

import Main from "./Main";

type ShopPageProps = {
  params: { shopId: string };
  searchParams: { table: string };
};

const ShopPage = async ({
  params: { shopId },
  searchParams: { table },
}: ShopPageProps) => {
  const shop = await prisma.coffeeShop.findUnique({
    where: { id: shopId },
  });

  if (!shop) {
    return (
      <div>
        <h1>Shop not found</h1>
      </div>
    );
  }

  const currentPlayingSong = await prisma.queueSong.findFirst({
    where: { coffeeShopId: shop.id },
    include: { song: { include: { artist: true } } },
  });
  return (
    <Main
      shop={shop}
      table={table}
      currentPlayingSong={
        currentPlayingSong
          ? {
              ...currentPlayingSong.song,
              Artist: currentPlayingSong.song.artist,
            }
          : undefined
      }
    />
  );
};

export default ShopPage;
