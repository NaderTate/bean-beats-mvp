import Image from "next/image";
import { Genre } from "@prisma/client";
import React, { useState, useCallback } from "react";

type Props = {
  genres: Genre[];
  selectedGenreIds: string[];
  handleCheckboxChange: (selectedGenreIds: string[]) => void;
};

const SelectGenres = ({
  genres,
  handleCheckboxChange,
  selectedGenreIds,
}: Props) => {
  const [selectedGenres, setSelectedGenres] =
    useState<string[]>(selectedGenreIds);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChangeInternal = useCallback(
    (genreId: string) => {
      const isSelected = selectedGenres.includes(genreId);
      const updatedSelectedGenres = isSelected
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId];

      setSelectedGenres(updatedSelectedGenres);
      handleCheckboxChange(updatedSelectedGenres); // Pass all selected genre IDs
    },
    [selectedGenres, handleCheckboxChange]
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search genres..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-2 border border-gray-300 rounded mb-4 w-full"
      />
      <div className="max-h-96 overflow-y-auto">
        {filteredGenres.length === 0 ? (
          <div className="text-gray-500">No results found</div>
        ) : (
          filteredGenres.map((genre) => (
            <div
              key={genre.id}
              className="cursor-pointer flex items-center space-x-3 mb-3"
            >
              <input
                type="checkbox"
                id={genre.id}
                value={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onChange={() => handleCheckboxChangeInternal(genre.id)}
                className="h-5 w-5 text-indigo-600 cursor-pointer"
              />
              <label
                htmlFor={genre.id}
                className="text-gray-700 cursor-pointer"
              >
                <div className="flex items-center gap-x-3">
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    width={200}
                    height={200}
                    className="rounded-full aspect-square object-cover w-14"
                  />
                  <span>{genre.name}</span>
                </div>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectGenres;
