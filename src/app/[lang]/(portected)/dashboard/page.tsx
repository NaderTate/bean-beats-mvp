import prisma from "@/lib/prisma";

import Main from "./Main";

const Page = async () => {
  const topSongs = await prisma.song.findMany({
    take: 5,
    orderBy: {
      timesPurchased: "desc",
    },
    select: {
      thumbnail: true,
      title: true,
      artist: {
        select: {
          name: true,
        },
      },
    },
  });

  return <Main topSongs={topSongs} />;
};

export default Page;
