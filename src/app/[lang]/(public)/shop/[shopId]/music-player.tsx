import Image from "next/image";
import { Artist, Song } from "@prisma/client";

interface FullSong extends Song {
  Artist: Artist | null;
}
type Props = { song: FullSong | undefined };

const SongPlayer = ({ song }: Props) => {
  if (!song) {
    return (
      <div className="rounded-lg bg-gray-100 border-2 p-5 mx-auto w-fit mt-10">
        <h4 className="text-xl font-medium">No Song Playing</h4>
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-gray-100 border-2 p-5 mx-auto w-fit mt-10">
      <h4 className="text-xl font-medium">Current Playing Song</h4>
      <Image
        width={400}
        height={300}
        alt="Album Image"
        src={song.thumbnail}
        className="rounded-lg my-5 aspect-square object-cover object-top"
      />
      <h5 className="text-lg font-semibold text-primary">{song.title}</h5>
      <h5 className="font-semibold text-gray-500">{song.Artist?.name}</h5>
    </div>
  );
};

export default SongPlayer;
