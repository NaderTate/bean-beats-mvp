"use client";

import Image from "next/image";
import { Song } from "@prisma/client";
import { FiMinusCircle } from "react-icons/fi";
import { MdAddCircleOutline } from "react-icons/md";
import { useSongsCart } from "@/store/songs-cart";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

type Props = { song: Song & { price: number | string } };

const SongCard = ({ song }: Props) => {
  const storedSongs = localStorage.getItem("songs");

  const { songs, addSong, removeSong, setSongs } = useSongsCart();
  const isSongInCart = songs.includes(song.id);
  const handleAddSong = (songId: string) => {
    const songs = storedSongs ? JSON.parse(storedSongs || "[]") : [];
    songs.push(song.id);
    localStorage.setItem("songs", JSON.stringify(songs));
    addSong(songId);
  };

  const handleRemoveSong = (songId: string) => {
    const songs = storedSongs ? JSON.parse(storedSongs || "[]") : [];
    const updatedSongs = songs.filter((s: string) => s !== song.id);
    localStorage.setItem("songs", JSON.stringify(updatedSongs));
    removeSong(songId);
  };

  useEffect(() => {
    if (storedSongs) {
      setSongs(JSON.parse(storedSongs || "[]"));
    }
  }, [setSongs, storedSongs]);

  const t = useTranslations();
  return (
    <div className="flex justify-between shadow-lg rounded-md p-5">
      <div className="flex flex-row gap-4">
        <div className="w-32 h-32 relative">
          <Image
            fill
            alt={song.title}
            src={song.thumbnail}
            className=" object-top object-cover rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-primary">{song.title}</h3>
          <span>{t("Price")}: </span>
          <span>{song.price}</span>
        </div>
      </div>
      <button
        onClick={
          isSongInCart
            ? () => handleRemoveSong(song.id)
            : () => handleAddSong(song.id)
        }
      >
        {isSongInCart ? (
          <FiMinusCircle size={25} className="text-primary cursor-pointer" />
        ) : (
          <MdAddCircleOutline
            size={24}
            className="text-primary cursor-pointer"
          />
        )}
      </button>
    </div>
  );
};

export default SongCard;
