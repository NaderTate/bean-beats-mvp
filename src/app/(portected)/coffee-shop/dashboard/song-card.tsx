import { Song } from "@prisma/client";
import Image from "next/image";

type Props = { song: Song & { artist: { name: string } | null } };

const SongCard = ({ song }: Props) => {
  return (
    <div className="rounded-lg shadow-xl">
      <Image
        src={song.thumbnail}
        alt={song.title}
        width={200}
        height={200}
        className="rounded-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{song.title}</h3>
        <p className="text-gray-500">{song.artist?.name}</p>
      </div>
    </div>
  );
};

export default SongCard;
