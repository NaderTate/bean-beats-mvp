"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Album, Artist, Song } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import Albums from "./albums";
// import AddSong from "./add-song";
import AddAlbum from "./add-album";
import Playlists from "./playlists";
// import SongsList from "./songs-list";
// import AddArtist from "./add-artist";
// import ArtistsList from "./artists-list";
import AddPlaylist from "./add-playlist";
import Modal from "@/components/shared/Modal";
import CompleteProfileWarning from "@/components/complete-profile-warning";

import useGetLang from "@/hooks/use-get-lang";

type Props = {
  // songs: {
  //   song: {
  //     artist: {
  //       name: string;
  //       image: string;
  //     } | null;
  //     id: string;
  //     title: string;
  //     thumbnail: string;
  //   };
  //   id: string;
  //   price: number;
  // }[];
  // artists: {
  //   id: string;
  //   name: string;
  //   _count: {
  //     Song: number;
  //   };
  //   image: string;
  // }[];
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
  allPlaylists: {
    id: string;
    name: string;
    _count: {
      songs: number;
    };
    shopId: string | null;
    songsIds: string[];
  }[];
  allAlbums: Album[];
  allArtists: Artist[];
  allSongs: Song[];
  shopId: string;
  isShopDataComplete: boolean;
};

const MusicMain = ({
  // songs,
  shopId,
  albums,
  // artists,
  allPlaylists,
  allSongs,
  allAlbums,
  // allArtists,
  isShopDataComplete,
}: Props) => {
  const t = useTranslations();
  const { lang } = useGetLang();
  const { refresh, push } = useRouter();
  const searchParams = useSearchParams();

  const section = searchParams.get("section");

  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(section || "Albums");

  const toggleModal = () => {
    setTimeout(() => {
      refresh();
    }, 1000);
    setOpen(!open);
  };

  const actionButtons: Array<{ label: string }> = [
    // { label: "Artists" },
    { label: "Albums" },
    // { label: "Songs" },
    { label: "Playlists" },
  ];

  return (
    <div className="p-5">
      \
      <div className="flex justify-center gap-x-2">
        {actionButtons.map((button) => (
          <button
            key={button.label}
            onClick={() => {
              setCurrentSection(button.label);
              push(`/${lang}/coffee-shop/music?section=${button.label}`);
            }}
            className={`capitalize transition-colors ${
              currentSection === button.label
                ? "bg-white border-primary border text-primary "
                : "bg-gray-100 text-gray-900 border-gray-300 border"
            } px-9 py-3 rounded-md`}
          >
            {t(button.label)}
          </button>
        ))}
      </div>
      <div>
        {/* {currentSection === "Artists" && (
          <ArtistsList
            artists={artists}
            setOpen={() => {
              setOpen(true);
            }}
          />
        )} */}
        {currentSection === "Albums" && (
          <Albums
            shopId={shopId}
            albums={albums}
            setOpen={() => {
              setOpen(true);
            }}
          />
        )}
        {/* {currentSection === "Songs" && (
          <SongsList
            songs={songs}
            setOpen={() => {
              setOpen(true);
            }}
          />
        )} */}
        {currentSection === "Playlists" && (
          <Playlists
            allSongs={allSongs}
            onSubmit={toggleModal}
            playlists={
              allPlaylists.filter((playlist) => playlist.shopId === shopId) ||
              []
            }
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
          currentSection === "Albums"
            ? t("Add Album")
            : currentSection === "Songs"
            ? t("Add Song")
            : currentSection === "Artists"
            ? t("Add Artist")
            : t("Add Playlist")
        }
      >
        {/* {currentSection === "Albums" && (
          <AddAlbum
            shopId={shopId}
            allAlbums={
              // filter albums that are not already in the shop
              allAlbums.filter(
                (album) =>
                  !albums.find((shopAlbum) => shopAlbum.id === album.id)
              )
            }
            onSubmit={toggleModal}
          />
        )} */}
        {/* {currentSection === "Songs" && (
          <AddSong
            allSongs={
              // filter songs that are not already in the shop
              allSongs.filter(
                (song) =>
                  !songs.find((shopSong) => shopSong.song.id === song.id)
              )
            }
            onSubmit={toggleModal}
            shopId={shopId}
          />
        )} */}
        {/* {currentSection === "Artists" && (
          <AddArtist
            shopId={shopId}
            onSubmit={toggleModal}
            allArtists={
              // filter artists that are not already in the shop
              allArtists.filter(
                (artist) =>
                  !artists.find((shopArtist) => shopArtist.id === artist.id)
              )
            }
          />
        )} */}
        {/* {currentSection === "Playlists" && (
          <AddPlaylist
            shopId={shopId}
            allSongs={allSongs}
            onSubmit={toggleModal}
            allPlaylists={
              // filter playlists that are not already in the shop
              allPlaylists.filter(
                (playlist) => !playlist.shopId || playlist.shopId !== shopId
              )
            }
          />
        )} */}
        {!isShopDataComplete ? (
          <CompleteProfileWarning shopId={shopId} onSubmit={toggleModal} />
        ) : currentSection === "Albums" ? (
          <AddAlbum
            shopId={shopId}
            allAlbums={allAlbums.filter(
              (album) => !albums.find((shopAlbum) => shopAlbum.id === album.id)
            )}
            onSubmit={toggleModal}
          />
        ) : (
          <AddPlaylist
            shopId={shopId}
            allSongs={allSongs}
            onSubmit={toggleModal}
            allPlaylists={allPlaylists.filter(
              (playlist) => !playlist.shopId || playlist.shopId !== shopId
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default MusicMain;
