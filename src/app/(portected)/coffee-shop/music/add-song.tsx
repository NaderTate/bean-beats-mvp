import { Artist, Song } from "@prisma/client";
import { addSongsToShop } from "@/actions/songs";
import { useState } from "react";
import Spinner from "@/components/shared/spinner";
import toast from "react-hot-toast";
import Image from "next/image";
import { convertSecondsToTime } from "@/utils/conver-seconds-to-time";

type Props = { allSongs: Song[]; onSubmit: () => void; shopId: string };

const AddSong = ({ allSongs, onSubmit, shopId }: Props) => {
  const [selectedSongsIds, setSelectedSongsIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCheckboxChange = (songId: string) => {
    setSelectedSongsIds((prevSelectedAlbumIds) =>
      prevSelectedAlbumIds.includes(songId)
        ? prevSelectedAlbumIds.filter((id) => id !== songId)
        : [...prevSelectedAlbumIds, songId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await addSongsToShop({
      songIds: selectedSongsIds,
      shopId,
    });
    setIsSubmitting(false);
    toast.success("Song added successfully");
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Select Songs</h2>
      <div className="space-y-5">
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
            <label htmlFor={song.id} className="text-gray-700 cursor-pointer">
              <div className="flex items-center gap-x-3">
                <Image
                  src={song.thumbnail}
                  alt={song.title}
                  width={50}
                  height={50}
                  className="rounded-full aspect-square object-cover"
                />
                {song.title}
                <span className="font-medium">
                  {" "}
                  {convertSecondsToTime(song.duration)}
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-5 inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
      >
        {isSubmitting ? <Spinner /> : "Submit"}
      </button>
    </div>
  );
};

export default AddSong;
