import { Album } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

type Props = { albums: ExtendedAlbum[] };

const Albums = ({ albums }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5">
      {albums.map((album) => (
        <Card key={album.id} {...album} />
      ))}
    </div>
  );
};

export default Albums;

const Card = (album: ExtendedAlbum) => {
  const t = useTranslations();
  return (
    <div className=" shadow-lg rounded-md p-5">
      <div className="flex flex-col gap-4">
        <div className="w-full h-32 relative">
          <Image
            fill
            alt={album.name}
            src={album.image}
            className=" object-top object-cover rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-primary">{album.name}</h3>
          <h3 className="text-gray-500">{album?.artist?.name}</h3>
          <span className="flex gap-x-2">
            <span>{t("Songs")}:</span>
            <span> {album._count.Song}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
