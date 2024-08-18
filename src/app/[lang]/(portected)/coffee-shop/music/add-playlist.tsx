import { useState } from "react";
import { Playlist, Song } from "@prisma/client";
import { useRouter } from "next/navigation";

import Modal from "@/components/shared/Modal";
import PlaylistForm from "@/components/shared/Forms/playlist";
import { addPlaylistsToShop } from "@/actions/playlists";
import toast from "react-hot-toast";

type Props = {
  onSubmit: () => void;
  allSongs: Song[];
  shopPlaylists: {
    name: string;
    id: string;
    _count: {
      songs: number;
    };
  }[];
  shopId: string;
};

const AddPlaylist = ({ onSubmit, allSongs, shopPlaylists, shopId }: Props) => {
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();

  const toggleModal = () => {
    setTimeout(() => {
      refresh();
    }, 1000);
    setOpen(!open);
  };

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
    toast.success("Artist added successfully");
    onSubmit();
  };

  return (
    <div>
      <button onClick={toggleModal} className="btn-primary">
        Create Playlist
      </button>
      <Modal open={open} setOpen={toggleModal} title={"Create Playlist"}>
        <PlaylistForm onSubmit={onSubmit} allSongs={allSongs} />
      </Modal>
    </div>
  );
};

export default AddPlaylist;
