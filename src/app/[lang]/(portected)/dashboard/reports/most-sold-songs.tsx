"use client";

import React from "react";
import Table from "@/components/shared/table";
import ExportBtn from "@/components/export-btn";

type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  timesPurchased: number;
};

type MostSoldSongsProps = {
  songs: Song[];
};

const MostSoldSongs: React.FC<MostSoldSongsProps> = ({ songs }) => {
  // Map the songs data to include a number field
  const tableData = songs.map((song, index) => ({
    ...song,
    number: index + 1,
  }));

  // Define the fields for the table
  const fields = {
    number: "#",
    title: "Song",
    artist: "Artist",
    album: "Album",
    timesPurchased: "Times Purchased",
  };

  // Prepare data for CSV export
  const csvData = songs.map((song, index) => ({
    "#": index + 1,
    Song: song.title,
    Artist: song.artist,
    Album: song.album,
    "Times Purchased": song.timesPurchased,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Most Sold Songs</h2>
        <ExportBtn csvData={csvData} filename="most_sold_songs.csv" />
      </div>
      <Table hideSearch fields={fields} data={tableData} />
    </div>
  );
};

export default MostSoldSongs;
