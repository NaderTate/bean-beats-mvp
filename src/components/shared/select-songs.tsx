import { Song } from "@prisma/client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";

type Props = {
  songs: Song[];
  selectedSongIds: string[];
  handleCheckboxChange: (selectedSongIds: string[]) => void;
};

const SelectSongs = ({
  songs,
  selectedSongIds,
  handleCheckboxChange,
}: Props) => {
  const [selectedSongs, setSelectedSongs] = useState<string[]>(selectedSongIds);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChangeInternal = useCallback(
    (songId: string) => {
      const isSelected = selectedSongs.includes(songId);
      const updatedSelectedSongs = isSelected
        ? selectedSongs.filter((id) => id !== songId)
        : [...selectedSongs, songId];

      setSelectedSongs(updatedSelectedSongs);
      handleCheckboxChange(updatedSelectedSongs);
    },
    [selectedSongs, handleCheckboxChange]
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search songs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />
      <div className="max-h-96 overflow-y-auto">
        {filteredSongs.length === 0 ? (
          <div className="text-gray-500">No results found</div>
        ) : (
          filteredSongs.map((song) => (
            <div
              key={song.id}
              className="cursor-pointer flex items-center space-x-3 mb-3"
            >
              <input
                type="checkbox"
                id={song.id}
                value={song.id}
                checked={selectedSongs.includes(song.id)}
                onChange={() => handleCheckboxChangeInternal(song.id)}
                className="h-5 w-5 text-indigo-600 cursor-pointer"
              />
              <label htmlFor={song.id} className="text-gray-700 cursor-pointer">
                <div className="flex items-center gap-x-3">
                  <Image
                    src={song.thumbnail}
                    alt={song.title}
                    width={200}
                    height={200}
                    className="rounded-full aspect-square object-cover w-14"
                  />
                  <span>{song.title}</span>
                </div>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectSongs;
