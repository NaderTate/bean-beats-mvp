import { Artist } from "@prisma/client";
import { addArtistsToShop } from "@/actions/artists";
import { useState } from "react";
import Spinner from "@/components/shared/spinner";
import toast from "react-hot-toast";
import Image from "next/image";

type Props = { allArtists: Artist[]; onSubmit: () => void; shopId: string };

const AddArtist = ({ allArtists, onSubmit, shopId }: Props) => {
  const [selectedArtistsIds, setSelectedArtistsIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleCheckboxChange = (artistId: string) => {
    setSelectedArtistsIds((prevSelectedAlbumIds) =>
      prevSelectedAlbumIds.includes(artistId)
        ? prevSelectedAlbumIds.filter((id) => id !== artistId)
        : [...prevSelectedAlbumIds, artistId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await addArtistsToShop({
      artistIds: selectedArtistsIds,
      shopId,
    });
    setIsSubmitting(false);
    toast.success("Artist added successfully");
    onSubmit();
  };

  return (
    <div className="bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Select Artists</h2>
      <div className="space-y-5">
        {allArtists.map((artist) => (
          <div
            key={artist.id}
            className="cursor-pointer flex items-center space-x-3"
          >
            <input
              type="checkbox"
              id={artist.id}
              value={artist.id}
              onChange={() => handleCheckboxChange(artist.id)}
              className="h-5 w-5 text-indigo-600 cursor-pointer"
            />
            <label htmlFor={artist.id} className="text-gray-700 cursor-pointer">
              <div className="flex items-center gap-x-3">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={200}
                  height={200}
                  className="rounded-full aspect-square object-cover w-14"
                />
                <span>{artist.name}</span>
              </div>
            </label>
          </div>
        ))}
      </div>
      <button
        disabled={selectedArtistsIds.length === 0 || isSubmitting}
        onClick={handleSubmit}
        className={`mt-5 inline-block w-full rounded-lg ${
          selectedArtistsIds.length === 0
            ? "bg-gray-300 text-gray-600"
            : "bg-primary hover:bg-primary"
        } transition px-5 py-3 font-medium text-white sm:w-auto`}
      >
        {isSubmitting ? <Spinner /> : "Submit"}
      </button>
    </div>
  );
};

export default AddArtist;
