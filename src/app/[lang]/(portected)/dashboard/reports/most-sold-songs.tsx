"use client";

import React from "react";
import Table from "@/components/shared/table";
import ExportBtn from "@/components/export-btn";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();

  // Map the songs data to include a number field
  const tableData = songs.map((song, index) => ({
    ...song,
    number: index + 1,
  }));

  // Define the fields for the table with translations
  const fields = {
    number: "#",
    title: t("Song"),
    artist: t("Artist"),
    album: t("Album"),
    timesPurchased: t("Times Purchased"),
  };

  // Prepare data for CSV export with translations
  const csvData = songs.map((song, index) => ({
    [t("#")]: index + 1,
    [t("Song")]: song.title,
    [t("Artist")]: song.artist,
    [t("Album")]: song.album,
    [t("Times Purchased")]: song.timesPurchased,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("Most Sold Songs")}</h2>
        <ExportBtn csvData={csvData} filename="most_sold_songs.csv" />
      </div>
      <Table hideSearch fields={fields} data={tableData} />
    </div>
  );
};

export default MostSoldSongs;
