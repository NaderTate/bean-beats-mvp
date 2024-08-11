"use client";

import { useState } from "react";
import { Album, Artist, Song } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import Albums from "./albums";
import AddSong from "./add-song";
import AddAlbum from "./add-album";
import SongsList from "./songs-list";
import AddArtist from "./add-artist";
import ArtistsList from "./artists-list";
import Modal from "@/components/shared/Modal";

type Props = {
  songs: {
    song: {
      artist: {
        name: string;
        image: string;
      } | null;
      id: string;
      title: string;
      thumbnail: string;
    };
    id: string;
    price: number;
  }[];
  artists: {
    id: string;
    name: string;
    _count: {
      Song: number;
    };
    image: string;
  }[];
  albums: {
    artist: {
      name: string;
    };
    name: string;
    _count: {
      Song: number;
    };
    image: string;
    id: string;
  }[];
  allAlbums: Album[];
  allArtists: Artist[];
  allSongs: Song[];
  shopId: string;
};

const MusicMain = ({
  songs,
  shopId,
  albums,
  artists,
  allSongs,
  allAlbums,
  allArtists,
}: Props) => {
  const { refresh, push } = useRouter();

  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const [currentSection, setCurrentSection] = useState(section || "artists");

  const toggleModal = () => {
    setTimeout(() => {
      refresh();
    }, 1000);
    setOpen(!open);
  };

  const actionButtons: Array<{ label: string }> = [
    { label: "artists" },
    { label: "albums" },
    { label: "songs" },
  ];

  return (
    <div>
      <div className="flex justify-center space-x-2">
        {actionButtons.map((button) => (
          <button
            key={button.label}
            onClick={() => {
              setCurrentSection(button.label);
              push(`/coffee-shop/music?section=${button.label}`);
            }}
            className={`capitalize transition-colors ${
              currentSection === button.label
                ? "bg-white border-primary border text-primary "
                : "bg-gray-100 text-gray-900 border-gray-300 border"
            } px-9 py-3 rounded-md`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div>
        {currentSection === "artists" && (
          <ArtistsList
            artists={artists}
            setOpen={() => {
              setOpen(true);
            }}
          />
        )}
        {currentSection === "albums" && (
          <Albums
            albums={albums}
            setOpen={() => {
              setOpen(true);
            }}
          />
        )}
        {currentSection === "songs" && (
          <SongsList
            songs={songs}
            setOpen={() => {
              setOpen(true);
            }}
          />
        )}
      </div>
      <Modal
        open={open}
        setOpen={toggleModal}
        title={
          currentSection === "albums"
            ? "Add Album"
            : currentSection === "songs"
            ? "Add Song"
            : "Add Artist"
        }
      >
        {currentSection === "albums" && (
          <AddAlbum
            shopId={shopId}
            allAlbums={allAlbums}
            onSubmit={toggleModal}
          />
        )}
        {currentSection === "songs" && (
          <AddSong allSongs={allSongs} onSubmit={toggleModal} shopId={shopId} />
        )}
        {currentSection === "artists" && (
          <AddArtist
            shopId={shopId}
            onSubmit={toggleModal}
            allArtists={allArtists}
          />
        )}
      </Modal>
    </div>
  );
};

export default MusicMain;
