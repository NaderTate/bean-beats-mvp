import { NextPage } from "next";
import prisma from "@/lib/prisma";

import { getUser } from "@/utils/get-user";
import MusicMain from "./main";

type MusicPageProps = {};

const MusicPage: NextPage = async ({}: MusicPageProps) => {
  const user = await getUser();

  const coffeeShop = user
    ? await prisma.coffeeShop.findFirst({
        where: { adminId: user?.id },
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
      })
    : null;

  const allAlbums =
    (coffeeShop &&
      (await prisma.album.findMany({
        where: {
          NOT: {
            id: {
              in: coffeeShop.Albums.map((album) => album.id),
            },
          },
        },
      }))) ||
    [];
  const allArtists =
    (coffeeShop &&
      (await prisma.artist.findMany({
        where: {
          NOT: {
            id: {
              in: coffeeShop.Artists.map((artist) => artist.id),
            },
          },
        },
      }))) ||
    [];
  const allSongs =
    (coffeeShop &&
      (await prisma.song.findMany({
        where: {
          NOT: {
            id: {
              in: coffeeShop.SongCoffeeShop.map((song) => song.song.id),
            },
          },
        },
      }))) ||
    [];

  return (
    <>
      {coffeeShop && (
        <MusicMain
          shopId={coffeeShop.id}
          allSongs={allSongs}
          allAlbums={allAlbums}
          allArtists={allArtists}
          songs={coffeeShop?.SongCoffeeShop}
          albums={coffeeShop?.Albums}
          artists={coffeeShop?.Artists}
        />
      )}
    </>
  );
};

export default MusicPage;
