"use client";

import { Genre } from "@prisma/client";
import React, { useState, useEffect } from "react";
import GenreCard from "./genre-card";
import Input from "@/components/shared/Input";
import { useTranslations } from "next-intl";

type Props = { genres: Genre[]; shopId: string };

const GenresMain = ({ genres, shopId }: Props) => {
  // State to hold the search term
  const [searchTerm, setSearchTerm] = useState("");

  // State for the debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const t = useTranslations();
  // useEffect for debouncing the search term
  useEffect(() => {
    // Set a timeout to update the debounced search term after 300ms
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Adjust the delay (in milliseconds) as needed

    // Cleanup function that runs if the effect is re-run before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Only re-run the effect if searchTerm changes

  // Filter genres based on the debounced search term
  const filteredGenres = genres.filter((genre) =>
    genre.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Input */}
      <Input
        label="Search genres"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />

      {/* Display filtered genres */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filteredGenres.length > 0 ? (
          filteredGenres.map((genre) => (
            <GenreCard key={genre.id} genre={genre} shopId={shopId} />
          ))
        ) : (
          <p>{t("No genres found")}</p>
        )}
      </div>
    </div>
  );
};

export default GenresMain;
