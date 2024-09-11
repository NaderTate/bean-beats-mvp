import { useState } from "react";
import { Playlist, Song } from "@prisma/client";
import { useRouter } from "next/navigation";

import Modal from "@/components/shared/Modal";
import PlaylistForm from "@/components/shared/Forms/playlist";
import { addPlaylistsToShop } from "@/actions/playlists";
import toast from "react-hot-toast";
import Image from "next/image";
import Spinner from "@/components/shared/spinner";
import { useTranslations } from "next-intl";

type Props = {
  onSubmit: () => void;
  allSongs: Song[];
  allPlaylists: {
    name: string;
    id: string;
    _count: {
      songs: number;
    };
  }[];
  shopId: string;
};

const AddPlaylist = ({ onSubmit, allSongs, allPlaylists, shopId }: Props) => {
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();

  const toggleModal = () => {
    setTimeout(() => {
      refresh();
    }, 1000);
    setOpen(!open);
  };

  const t = useTranslations();

  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCheckboxChange = (playlistId: string) => {
    setSelectedPlaylists((prevSelectedPlaylistsIds) =>
      prevSelectedPlaylistsIds.includes(playlistId)
        ? prevSelectedPlaylistsIds.filter((id) => id !== playlistId)
        : [...prevSelectedPlaylistsIds, playlistId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await addPlaylistsToShop({
      playlistsIds: selectedPlaylists,
      shopId,
    });
    setIsSubmitting(false);
    toast.success(t("Artist added successfully"));
    onSubmit();
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{t("Select Playlists")}</h2>
      <div className="space-y-5 h-80 mb-[80px] overflow-y-auto">
        {allPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="cursor-pointer flex items-center gap-x-3"
          >
            <input
              type="checkbox"
              id={playlist.id}
              value={playlist.id}
              onChange={() => handleCheckboxChange(playlist.id)}
              className="form-checkbox h-5 w-5 text-indigo-600 cursor-pointer"
            />
            <label
              htmlFor={playlist.id}
              className="text-gray-700 cursor-pointer"
            >
              <div className="flex items-center gap-x-3">
                {/* <Image
            src={playlist.image}
            alt={playlist.name}
            width={200}
            height={200}
            className="rounded-full aspect-square object-cover w-14"
          /> */}
                <span>{playlist.name}</span>
              </div>
            </label>
          </div>
        ))}
      </div>
      <button onClick={toggleModal} className="btn-primary">
        {t("Create Playlist")}
      </button>
      <div className="flex-shrink-0 absolute bottom-0 w-[95%] bg-white p-4 shadow-lg">
        <button
          disabled={selectedPlaylists.length === 0 || isSubmitting}
          onClick={handleSubmit}
          className={`mt-5 inline-block w-full rounded-lg ${
            selectedPlaylists.length === 0 || isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-primary hover:bg-primary/80"
          } transition px-5 py-3 font-medium text-white sm:w-auto`}
        >
          {isSubmitting ? <Spinner /> : t("Submit")}
        </button>
      </div>
      <Modal open={open} setOpen={toggleModal} title={"Create Playlist"}>
        <PlaylistForm onSubmit={onSubmit} allSongs={allSongs} />
      </Modal>
    </div>
  );
};

export default AddPlaylist;
