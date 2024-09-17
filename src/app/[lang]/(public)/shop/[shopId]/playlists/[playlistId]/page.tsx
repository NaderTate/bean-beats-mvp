import SongCard from "../../music/song-card";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { FaMusic } from "react-icons/fa6";

type PalylistPageProps = { params: { shopId: string; playlistId: string } };

const PalylistPage = async ({
  params: { shopId, playlistId },
}: PalylistPageProps) => {
  const playlist = await prisma.playlist.findUnique({
    where: {
      id: playlistId,
    },
    include: { songs: { include: { SongCoffeeShop: true } } },
  });
  const SongCoffeeShop = await prisma.songCoffeeShop.findMany({
    where: {
      coffeeShopId: shopId,
    },
  });
  if (!playlist) {
    return (
      <div>
        <h1>Playlist not found</h1>
      </div>
    );
  }

  if (playlist.songs.length === 0) {
    return (
      <div>
        <h1>Playlist is empty</h1>
      </div>
    );
  }
  return (
    <div className="mt-24 px-14">
      <Image
        src={playlist.songs[0].thumbnail}
        className="w-full h-72 object-cover rounded-lg"
        width={2000}
        height={1000}
        alt={playlist.name}
      />
      <div className="flex justify-between">
        <h1 className="text-xl text-primary font-bold mt-4">{playlist.name}</h1>
        <p className="text-lg mt-4">
          <FaMusic className="inline-block mr-2 text-primary" />
          {playlist.songs.length}{" "}
          {playlist.songs.length === 1 ? "track" : "tracks"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {playlist.songs.map((song) => (
          <SongCard
            key={song.id}
            song={{
              ...song,
              price:
                SongCoffeeShop.find((s) => s.songId === song.id)?.price || 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PalylistPage;
