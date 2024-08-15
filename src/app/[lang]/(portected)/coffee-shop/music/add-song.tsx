import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { Song } from "@prisma/client";

import Spinner from "@/components/shared/spinner";

import { addSongsToShop } from "@/actions/songs";
import { convertSecondsToTime } from "@/utils/conver-seconds-to-time";

type Props = { allSongs: Song[]; onSubmit: () => void; shopId: string };

type SelectedSong = { songId: string; price: number };

const AddSong = ({ allSongs, onSubmit, shopId }: Props) => {
  console.log({ allSongs });
  const [selectedSongs, setSelectedSongs] = useState<SelectedSong[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckboxChange = (songId: string) => {
    setSelectedSongs((prevSelectedSongs) =>
      prevSelectedSongs.some((song) => song.songId === songId)
        ? prevSelectedSongs.filter((song) => song.songId !== songId)
        : [...prevSelectedSongs, { songId, price: 0.25 }]
    );
  };

  const handlePriceChange = (songId: string, price: number) => {
    setSelectedSongs((prevSelectedSongs) =>
      prevSelectedSongs.map((song) =>
        song.songId === songId ? { ...song, price } : song
      )
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await addSongsToShop({
      songsData: selectedSongs,
      shopId,
    });
    setIsSubmitting(false);
    toast.success("Song added successfully");
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Select Songs</h2>
      <div className="mb-16 space-y-5">
        {allSongs.map((song) => (
          <div
            key={song.id}
            className="cursor-pointer flex items-center space-x-3"
          >
            <input
              type="checkbox"
              id={song.id}
              value={song.id}
              onChange={() => handleCheckboxChange(song.id)}
              className="h-5 w-5 text-indigo-600 cursor-pointer"
            />
            <label
              htmlFor={song.id}
              className="text-gray-700 cursor-pointer flex items-center gap-x-3"
            >
              <Image
                src={song.thumbnail}
                alt={song.title}
                width={200}
                height={200}
                className="rounded-full aspect-square object-cover w-14"
              />
              <div>
                {song.title}
                <span className="font-medium block">
                  {convertSecondsToTime(song.duration)}
                </span>
              </div>
            </label>
            {selectedSongs.some((s) => s.songId === song.id) && (
              <div className="flex items-center gap-x-5">
                <h5>
                  Price <span className="text-xs">(USD)</span>:
                </h5>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    selectedSongs.find((s) => s.songId === song.id)?.price || 0
                  }
                  onChange={(e) =>
                    handlePriceChange(song.id, parseFloat(e.target.value))
                  }
                  className="ml-auto border rounded p-1 w-24"
                  placeholder="Price"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 absolute bottom-0 w-[95%] bg-white p-4 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={selectedSongs.length === 0 || isSubmitting}
          className={`w-full rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
            selectedSongs.length === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "hover:bg-primary-500 bg-primary "
          } transition`}
        >
          {isSubmitting ? <Spinner /> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AddSong;
