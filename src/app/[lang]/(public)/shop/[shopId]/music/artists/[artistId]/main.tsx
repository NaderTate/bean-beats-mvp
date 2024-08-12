"use client";

import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { Song } from "@prisma/client";
import Albums from "../../albums";
import Songs from "../../songs";

type Props = {
  songs: {
    song: Song;
    price: number;
  }[];
  albums: ExtendedAlbum[];
};

const MainArtist = ({ songs, albums }: Props) => {
  const [selectedTab, setSelectedTab] = React.useState("albums");

  return (
    <div>
      <div className="flex justify-start gap-2 items-center">
        <button title="go-back" className="p-2 ">
          <MdArrowBackIosNew />
        </button>

        <input
          type="text"
          placeholder="Search for artist"
          className="w-full p-2 border border-gray-300 rounded-lg  focus:outline-none"
        />
      </div>
      <div className="mt-8 flex justify-start items-center gap-2">
        <button
          onClick={() => setSelectedTab("albums")}
          type="button"
          className={`border p-3 px-6 rounded-full ${
            selectedTab === "albums" ? "bg-primary-500 text-white" : ""
          }`}
        >
          Albums
        </button>
        <button
          onClick={() => setSelectedTab("songs")}
          type="button"
          className={`border p-3 px-6 rounded-full ${
            selectedTab === "songs" ? "bg-primary-500 text-white" : ""
          }`}
        >
          Songs
        </button>
      </div>
      <div className="mt-8">
        {selectedTab === "albums" && <Albums albums={albums} />}
        {selectedTab === "songs" && <Songs songs={songs} />}
      </div>
    </div>
  );
};

export default MainArtist;
