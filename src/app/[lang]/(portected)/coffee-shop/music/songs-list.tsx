"use client";

import { deleteCoffeeShopSong } from "@/actions/songs";
import Table from "@/components/shared/table";

type Props = {
  songs: {
    song: {
      title: string;
      thumbnail: string;
      artist: {
        name: string;
        image: string;
      } | null;
      id: string;
    };
    id: string;
    price: number;
  }[];
  setOpen: () => void;
};

const SongsList = ({ songs, setOpen }: Props) => {
  return (
    <Table
      addBtnLabel="Add New Song"
      add={setOpen}
      deleteFn={deleteCoffeeShopSong}
      data={songs.map((song, i) => ({
        id: song.id,
        number: i + 1,
        price: song.price,
        title: song.song.title,
        thumbnail: song.song.thumbnail,
        artistName: song.song.artist?.name,
        artistImage: song.song.artist?.image,
      }))}
      fields={{
        number: "#",
        title: "Song Name",
        artistName: "Artist",
        price: "Price",
        thumbnail: "Image",
      }}
    />
  );
};

export default SongsList;
