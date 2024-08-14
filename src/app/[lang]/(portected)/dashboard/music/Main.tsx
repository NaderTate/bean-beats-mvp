"use client";

import React, { useState } from "react";
import { Album, Artist, Genre, Playlist, Song } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import Table from "@/components/shared/table";
import Modal from "@/components/shared/Modal";
import SongForm from "@/components/shared/Forms/song";
import AlbumForm from "@/components/shared/Forms/album";
import ArtistForm from "@/components/shared/Forms/artist";
import NCard from "@/components/shared/Cards/numeric-card";

import { deleteSong } from "@/actions/songs";
import { deleteAlbum } from "@/actions/albums";
import { deleteArtist } from "@/actions/artists";

import { FcList } from "react-icons/fc";
import { FaMusic } from "react-icons/fa";
import { FcMindMap } from "react-icons/fc";
import { BiSolidAlbum } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import { deletePlaylist } from "@/actions/playlists";

import useGetLang from "@/hooks/use-get-lang";
import PlaylistForm from "@/components/shared/Forms/playlist";
import { deleteGenre } from "@/actions/gneres";
import GenreForm from "@/components/shared/Forms/genre";

const tableData = {
  page: 2,
  pages: 5,
};

const fields = {
  songs: {
    title: "Title",
    thumbnail: "Image",
  },
  artists: {
    name: "Name",
    image: "Image",
  },
  albums: {
    year: "Year",
    name: "Name",
    image: "Image",
  },
  playlists: {
    name: "Name",
    image: "Image",
  },
  genres: {
    name: "Name",
    image: "Image",
  },
};

type MainProps = {
  artists: Artist[];
  albums: Album[];
  songs: Song[];
  playlists: Playlist[];
  genres: Genre[];
};

export default function Main(props: MainProps) {
  const list = [
    {
      title: "Songs",
      value: props.songs.length,
      Icon: () => <FaMusic className="text-4xl text-yellow-500" />,
    },
    {
      title: "Albums",
      value: props.albums.length,
      Icon: () => <BiSolidAlbum className="text-4xl text-blue-500" />,
    },
    {
      title: "Artists",
      value: props.artists.length,
      Icon: () => <BsFillPeopleFill className="text-4xl text-green-500" />,
    },
    {
      Icon: () => <FcList className="text-4xl text-blue-500" />,
      title: "Playlists",
      value: 12,
    },
    {
      Icon: () => <FcMindMap className="text-4xl text-blue-500" />,
      title: "Genres",
      value: props.genres.length,
    },
  ];

  type Selection = "songs" | "albums" | "artists" | "playlists" | "genres";
  const { push, refresh } = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section") as Selection;
  const [shownSection, setShownSection] = useState<Selection>(
    section || "songs"
  );
  const [open, setOpen] = useState(false);
  const { lang } = useGetLang();

  const toggleModal = () => {
    refresh();
    setTimeout(() => {
      refresh();
    }, 1000);
    setOpen((prev) => !prev);
  };

  const editForms = {
    songs: (
      <SongForm
        genres={props.genres}
        albums={props.albums}
        onSubmit={toggleModal}
        artists={props.artists}
      />
    ),
    albums: <AlbumForm onSubmit={toggleModal} artists={props.artists} />,
    artists: <ArtistForm onSubmit={toggleModal} />,
    playlists: <PlaylistForm onSubmit={toggleModal} allSongs={props.songs} />,
    genres: <GenreForm onSubmit={toggleModal} />,
  };

  const deleteFn = {
    songs: deleteSong,
    albums: deleteAlbum,
    artists: deleteArtist,
    playlists: deletePlaylist,
    genres: deleteGenre,
  };

  return (
    <main className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <section className=" grid col-span-1 gap-4 lg:grid-cols-5">
        {list.map((item) => (
          <NCard
            key={item.title + "section1"}
            item={item}
            selected={shownSection === item.title.toLowerCase()}
            cb={() => {
              push(
                `/${lang}/dashboard/music?section=${item.title.toLocaleLowerCase()}`
              );
              setShownSection(item.title.toLocaleLowerCase() as Selection);
            }}
          />
        ))}
      </section>
      <section>
        <Table
          {...tableData}
          add={() => {
            setOpen(true);
          }}
          data={props[shownSection]}
          fields={fields[shownSection]}
          deleteFn={deleteFn[shownSection]}
          editForm={editForms[shownSection]}
        />
      </section>
      <Modal
        open={open}
        setOpen={toggleModal}
        title={
          shownSection === "albums"
            ? "Add Album"
            : shownSection === "songs"
            ? "Add Song"
            : shownSection === "artists"
            ? "Add Artist"
            : shownSection === "playlists"
            ? "Add Playlist"
            : "Add Genre"
        }
      >
        {shownSection === "albums" && (
          <AlbumForm onSubmit={toggleModal} artists={props.artists} />
        )}
        {shownSection === "songs" && (
          <SongForm
            albums={props.albums}
            genres={props.genres}
            onSubmit={toggleModal}
            artists={props.artists}
          />
        )}
        {shownSection === "artists" && <ArtistForm onSubmit={toggleModal} />}
        {shownSection === "playlists" && (
          <PlaylistForm onSubmit={toggleModal} allSongs={props.songs} />
        )}
        {shownSection === "genres" && <GenreForm onSubmit={toggleModal} />}
      </Modal>
    </main>
  );
}
