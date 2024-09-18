import Image from "next/image";
import { Song } from "@prisma/client";
import { FiMinusCircle } from "react-icons/fi";
import { MdAddCircleOutline } from "react-icons/md";
import { useSongsCart } from "@/store/songs-cart";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

type Props = { song: Song & { price: number | string } };

const getStoredSongs = () => {
  if (typeof window !== "undefined") {
    const storedSongs = localStorage.getItem("songs");
    return storedSongs ? JSON.parse(storedSongs) : {};
  }
  return {};
};

const setStoredSongs = (songs: string[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("songs", JSON.stringify(songs));
  }
};

const SongCard = ({ song }: Props) => {
  const t = useTranslations();

  const { songs, addSong, removeSong, setSongs } = useSongsCart();

  const isSongInCart = song.id in songs;
  const songQuantity = songs[song.id] || 0;

  const handleAddSong = (songId: string) => {
    const songs = getStoredSongs();
    const quantity = songs[songId] || 0;
    songs[songId] = quantity + 1;
    setStoredSongs(songs);
    addSong(songId);
    toast.success(t("Song added to cart"));
  };

  const handleRemoveSong = (songId: string) => {
    const songs = getStoredSongs();
    const quantity = songs[songId];
    if (quantity <= 1) {
      delete songs[songId];
    } else {
      songs[songId] = quantity - 1;
    }
    setStoredSongs(songs);
    removeSong(songId);
    toast.success(t("Song removed from cart"));
  };

  useEffect(() => {
    const storedSongs = getStoredSongs();
    setSongs(storedSongs);
  }, [setSongs]);

  return (
    <div className="flex justify-between shadow-lg rounded-md p-5">
      <div className="flex flex-row gap-4">
        <div className="w-32 h-32 relative">
          <Image
            fill
            alt={song.title}
            src={song.thumbnail}
            className="object-top object-cover rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-primary">{song.title}</h3>
          <span>{t("Price")}: </span>
          <span>${song.price}</span>
          {isSongInCart && (
            <div>
              {t("Quantity")}: {songQuantity}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {isSongInCart && (
          <FiMinusCircle
            size={25}
            className="text-primary cursor-pointer"
            onClick={() => handleRemoveSong(song.id)}
          />
        )}
        <MdAddCircleOutline
          size={24}
          className="text-primary cursor-pointer"
          onClick={() => handleAddSong(song.id)}
        />
      </div>
    </div>
  );
};

export default SongCard;
