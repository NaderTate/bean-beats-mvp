import { convertSecondsToTime } from "@/utils/conver-seconds-to-time";
import { Artist, QueueSong, Song } from "@prisma/client";
import Image from "next/image";
import React from "react";

type SongProps = {
  song: {
    thumbnail: string;
    title: string;
    artist: {
      name: string;
    } | null;
    duration: number;
  };
};

type Props = { queue: (QueueSong & SongProps)[] };

function MainQueue({ queue }: Props) {
  return (
    <>
      {queue.map((q) => (
        <Card key={q.id} queue={q} />
      ))}
    </>
  );
}

export default MainQueue;

const Card = ({ queue }: { queue: QueueSong & SongProps }) => {
  return (
    <div className="flex  gap-4 w-96 justify-between p-5 border rounded-lg shadow-sm">
      <div className="flex flex-row gap-4">
        <Image
          width={100}
          height={100}
          src={queue.song.thumbnail}
          alt={queue.song.title}
          className="h-28 w-28 object-cover object-top rounded-lg"
        />
        <div>
          <h1 className="font-bold text-primary">{queue.song.title}</h1>
          <p className="text-gray-500">{queue?.song?.artist?.name}</p>
        </div>
      </div>
      <p>{convertSecondsToTime(queue.song.duration)}</p>
    </div>
  );
};
