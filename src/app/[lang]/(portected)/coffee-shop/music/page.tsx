import { NextPage } from "next";
import prisma from "@/lib/prisma";

import { getCoffeeShop, getUser } from "@/utils/get-user";
import MusicMain from "./main";

type MusicPageProps = {};

const MusicPage: NextPage = async ({}: MusicPageProps) => {
  const coffeeShop_ = await getCoffeeShop();
  if (!coffeeShop_) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <h1 className="font-bold text-xl">Coffee Shop not found</h1>
      </div>
    );
  }
  const coffeeShop = await prisma.coffeeShop.findUnique({
    where: { id: coffeeShop_.id },
    select: {
      id: true,
      SongCoffeeShop: {
        select: {
          id: true,
          price: true,
          song: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              artist: { select: { name: true, image: true } },
            },
          },
        },
        orderBy: { id: "desc" },
      },
      Artists: {
        select: {
          id: true,
          name: true,
          image: true,
          _count: { select: { Song: true } },
        },
        orderBy: { id: "desc" },
      },
      Albums: {
        select: {
          id: true,
          name: true,
          image: true,
          _count: { select: { Song: true } },
          artist: { select: { name: true } },
        },
        orderBy: { id: "desc" },
      },
    },
  });

  const allAlbums =
    (coffeeShop &&
      (await prisma.album.findMany({ orderBy: { id: "desc" } }))) ||
    [];

  const allArtists =
    (coffeeShop &&
      (await prisma.artist.findMany({ orderBy: { id: "desc" } }))) ||
    [];

  const allSongs =
    (coffeeShop && (await prisma.song.findMany({ orderBy: { id: "desc" } }))) ||
    [];

  const allPlaylists =
    (coffeeShop &&
      (await prisma.playlist.findMany({
        select: {
          name: true,
          _count: { select: { songs: true } },
          id: true,
          shopId: true,
          songsIds: true,
        },
        orderBy: { id: "desc" },
      }))) ||
    [];

  return (
    <>
      {coffeeShop && (
        <MusicMain
          allSongs={allSongs}
          allAlbums={allAlbums}
          shopId={coffeeShop.id}
          allArtists={allArtists}
          allPlaylists={allPlaylists}
          albums={coffeeShop?.Albums}
          artists={coffeeShop?.Artists}
          songs={coffeeShop?.SongCoffeeShop}
        />
      )}
    </>
  );
};

export default MusicPage;
