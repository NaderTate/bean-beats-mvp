"use client";
import React, { useState } from "react";
import NCard from "@/components/shared/Cards/numeric-card";
import Table from "@/components/shared/table";
import { FaMusic } from "react-icons/fa";
import { BiSolidAlbum } from "react-icons/bi";
import { BsFillPeopleFill } from "react-icons/bs";
import Modal from "@/components/shared/Modal";
import ArtistForm from "@/components/shared/Forms/artist";
import { Album, Artist, Song } from "@prisma/client";
import SongForm from "@/components/shared/Forms/song";
import AlbumForm from "@/components/shared/Forms/album";
import { useRouter, useSearchParams } from "next/navigation";

const list = [
  {
    title: "Songs",
    value: "1,600",
    Icon: () => <FaMusic className="text-4xl text-yellow-500" />,
  },
  {
    title: "Albums",
    value: "200",
    Icon: () => <BiSolidAlbum className="text-4xl text-blue-500" />,
  },
  {
    title: "Artists",
    value: "100",
    Icon: () => <BsFillPeopleFill className="text-4xl text-green-500" />,
  },
];

const tableData = {
  page: 2,
  pages: 5,
};

const fields = {
  songs: {
    title: "Title",
    price: "Price",
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
};

type MainProps = {
  artists: Artist[];
  albums: Album[];
  songs: Song[];
};

enum Selection {
  albums = "albums",
  songs = "songs",
  artists = "artists",
}

export default function Main(props: MainProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const [shownSection, setShownSection] = useState<
    "albums" | "songs" | "artists"
  >((section as Selection) || "albums");
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    router.refresh();
    router.refresh();
    setOpen(!open);
  };

  const editForms = {
    songs: (
      <SongForm
        albums={props.albums}
        artists={props.artists}
        onSubmit={toggleModal}
      />
    ),
    albums: <AlbumForm onSubmit={toggleModal} artists={props.artists} />,
    artists: <ArtistForm onSubmit={toggleModal} />,
  };

  return (
    <main className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <section className=" grid col-span-1 gap-4 lg:grid-cols-3 section1">
        {list.map((item) => (
          <NCard
            key={item.title + "section1"}
            item={item}
            selected={shownSection === item.title.toLowerCase()}
            cb={() => {
              router.push(
                `/dashboard/music?section=${item.title.toLocaleLowerCase()}`
              );
              setShownSection(item.title.toLocaleLowerCase() as Selection);
            }}
          />
        ))}
      </section>
      <section>
        <Table
          {...tableData}
          fields={fields[shownSection]}
          data={props[shownSection]}
          add={toggleModal}
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
            : "Add Artist"
        }
      >
        {shownSection === "albums" && (
          <AlbumForm onSubmit={toggleModal} artists={props.artists} />
        )}
        {shownSection === "songs" && (
          <SongForm
            albums={props.albums}
            artists={props.artists}
            onSubmit={toggleModal}
          />
        )}
        {shownSection === "artists" && <ArtistForm onSubmit={toggleModal} />}
      </Modal>
    </main>
  );
}
