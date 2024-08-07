import { useState } from "react";
import toast from "react-hot-toast";
import { Album } from "@prisma/client";

import Spinner from "@/components/shared/spinner";
import { addAlbumsToShop } from "@/actions/albums";
import Image from "next/image";

type Props = { allAlbums: Album[]; onSubmit: () => void; shopId: string };

const AddAlbum = ({ allAlbums, shopId, onSubmit }: Props) => {
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCheckboxChange = (albumId: string) => {
    setSelectedAlbumIds((prevSelectedAlbumIds) =>
      prevSelectedAlbumIds.includes(albumId)
        ? prevSelectedAlbumIds.filter((id) => id !== albumId)
        : [...prevSelectedAlbumIds, albumId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await addAlbumsToShop({
      albumsIds: selectedAlbumIds,
      shopId,
    });
    setIsSubmitting(false);
    toast.success("Albums added successfully");
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Select Albums</h2>
      <div className="space-y-5">
        {allAlbums.map((album) => (
          <div
            key={album.id}
            className="cursor-pointer flex items-center space-x-3"
          >
            <input
              type="checkbox"
              id={album.id}
              value={album.id}
              onChange={() => handleCheckboxChange(album.id)}
              className="form-checkbox h-5 w-5 text-indigo-600 cursor-pointer"
            />
            <label htmlFor={album.id} className="text-gray-700 cursor-pointer">
              <div className="flex items-center gap-x-3">
                <Image
                  src={album.image}
                  alt={album.name}
                  width={200}
                  height={200}
                  className="rounded-full aspect-square object-cover w-14"
                />
                <span>
                  {album.name} ({album.year ?? "Unknown Year"})
                </span>
              </div>
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-5 inline-block w-full rounded-lg bg-primary hover:bg-primary-500 transition px-5 py-3 font-medium text-white sm:w-auto"
      >
        {isSubmitting ? <Spinner /> : "Submit"}
      </button>
    </div>
  );
};

export default AddAlbum;
