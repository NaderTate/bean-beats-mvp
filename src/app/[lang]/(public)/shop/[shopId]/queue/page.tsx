import prisma from "@/lib/prisma";
import MainQueue from "./Main";
import { getTranslations } from "next-intl/server";

type QueuePageProps = { params: { shopId: string } };

const QueuePage = async ({ params: { shopId } }: QueuePageProps) => {
  const t = await getTranslations();
  const queue = await prisma.queueSong.findMany({
    where: {
      coffeeShopId: shopId,
    },
    include: {
      song: {
        select: {
          title: true,
          thumbnail: true,
          artist: { select: { name: true } },
          duration: true,
        },
      },
    },
  });

  console.log(queue);

  return (
    <div className="mt-24 px-10 w-fit ">
      <div className="flex flex-col gap-5">
        <h1 className="text-2xl font-bold text-primary-500">
          {t("Music Queue")}
        </h1>
        <MainQueue queue={queue} />
      </div>
    </div>
  );
};

export default QueuePage;
