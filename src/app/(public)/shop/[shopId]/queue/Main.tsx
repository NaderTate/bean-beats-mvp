import { Artist, QueueSong, Song } from "@prisma/client";
import Image from "next/image";
import React from "react";

function convertSecondsToTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = (seconds % 60).toFixed(0);

  const formattedHours = hours.toString();
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  if (hours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}

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
      {queue.map(q => (
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
