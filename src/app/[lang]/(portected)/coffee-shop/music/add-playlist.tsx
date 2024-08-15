import { useState } from "react";
import { Song } from "@prisma/client";
import { useRouter } from "next/navigation";

import Modal from "@/components/shared/Modal";
import PlaylistForm from "@/components/shared/Forms/playlist";

type Props = { onSubmit: () => void; allSongs: Song[] };

const AddPlaylist = ({ onSubmit, allSongs }: Props) => {
  const [open, setOpen] = useState(false);
  const { refresh } = useRouter();

  const toggleModal = () => {
    setTimeout(() => {
      refresh();
    }, 1000);
    setOpen(!open);
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
