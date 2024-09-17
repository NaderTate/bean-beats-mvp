import prisma from "@/lib/prisma";
import SongCard from "../../song-card";
import Image from "next/image";
import { FaMusic } from "react-icons/fa";

type GenrePageProps = { params: { shopId: string; genreId: string } };

const GenrePage = async ({ params: { genreId, shopId } }: GenrePageProps) => {
  const genre = await prisma.genre.findUnique({
    where: {
      id: genreId,
    },
    include: { songs: true },
  });
  const SongCoffeeShop = await prisma.songCoffeeShop.findMany({
    where: {
      coffeeShopId: shopId,
    },
  });
  if (!genre) {
    return (
      <div>
        <h1>Genre not found</h1>
      </div>
    );
  }
  return (
    <div className="mt-24 px-14">
      <Image
        src={genre.image}
        className="w-full h-72 object-cover rounded-lg"
        width={2000}
        height={1000}
        alt={genre.name}
      />
      <div className="flex justify-between">
        <h1 className="text-xl text-primary font-bold mt-4">{genre.name}</h1>
        <p className="text-lg mt-4">
          <FaMusic className="inline-block mr-2 text-primary" />
          {genre.songs.length} {genre.songs.length === 1 ? "track" : "tracks"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {genre.songs.map((song) => (
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

export default GenrePage;
