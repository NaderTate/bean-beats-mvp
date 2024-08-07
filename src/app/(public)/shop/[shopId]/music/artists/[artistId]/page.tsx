import prisma from "@/lib/prisma";
import { MdArrowBackIosNew } from "react-icons/md";
import MainArtist from "./main";

type ArtistPageProps = { params: { artistId: string; shopId: string } };

const ArtistPage = async ({
  params: { artistId, shopId },
}: ArtistPageProps) => {
  const songs = await prisma.song.findMany({
    where: {
      coffeeShopsIds: { has: shopId },
      artistId,
    },
  });

  const albums = await prisma.album.findMany({
    where: { coffeeShopsIds: { has: shopId }, artistId },
    include: {
      artist: { select: { name: true } },
      _count: { select: { Song: true } },
    },
  });

  return (
    <div className="mt-24 px-14">
      <MainArtist songs={songs} albums={albums} />
    </div>
  );
};

export default ArtistPage;
