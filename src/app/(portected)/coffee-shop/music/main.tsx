"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Albums from "./albums";
import SongsList from "./songs-list";
import ArtistsList from "./artists-list";
import Modal from "@/components/shared/Modal";
import { Album, Artist, Song } from "@prisma/client";
import AddAlbum from "./add-album";
import AddSong from "./add-song";
import AddArtist from "./add-artist";

type Props = {
  songs: {
    id: string;
    artist: {
      name: string;
      image: string;
    } | null;
    title: string;
    price: number;
    thumbnail: string;
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
  albums,
  artists,
  allAlbums,
  allArtists,
  allSongs,
  shopId,
}: Props) => {
  const { refresh } = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(section ?? "artists");

  useEffect(() => {
    if (section) {
      setCurrentSection(section);
    }
  }, [section]);

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
            onClick={() => setCurrentSection(button.label)}
            className={`capitalize transition-colors ${
              currentSection === button.label
                ? "bg-white border-primary border text-primary "
                : "bg-gray-100 text-gray-900 border-gray-300 border"
            } px-4 py-2 rounded-md`}
          >
            {button.label}
          </button>
        ))}
      </div>
      <div>
        {currentSection === "artists" && (
          <ArtistsList artists={artists} setOpen={toggleModal} />
        )}
        {currentSection === "albums" && (
          <Albums albums={albums} setOpen={toggleModal} />
        )}
        {currentSection === "songs" && (
          <SongsList songs={songs} setOpen={toggleModal} />
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
