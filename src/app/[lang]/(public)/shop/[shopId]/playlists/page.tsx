import { NextPage } from "next";
import prisma from "@/lib/prisma";
type PlaylistsPageProps = {
  params: { shopId: string };
};

const PlaylistsPage = async ({ params: { shopId } }: PlaylistsPageProps) => {
  const playlists = await prisma.playlist.findMany({
    where: {
      shopId,
    },
  });

  return <div className="mt-24 px-14">PlaylistsPage</div>;
};

export default PlaylistsPage;
