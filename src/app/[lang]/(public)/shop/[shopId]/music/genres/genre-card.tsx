"use client";

import useGetLang from "@/hooks/use-get-lang";
import { Genre } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = { genre: Genre; shopId: string };

const GenreCard = ({ genre, shopId }: Props) => {
  const { lang } = useGetLang();
  return (
    <div className="relative w-[200px] h-[200px]">
      <Link href={`/${lang}/shop/${shopId}/music/genres/${genre.id}`}>
        {/* Back card 2 */}
        <div className="absolute top-3 left-3 w-full h-full bg-gray-100 rounded-lg border"></div>
        {/* Back card 1 */}
        <div className="absolute top-1 left-1 w-full h-full bg-gray-200 rounded-lg border"></div>
        {/* Front card (Genre Image) */}
        <div className="relative">
          {/* Image */}
          <Image
            src={genre.image}
            width={200}
            height={200}
            alt={genre.name}
            className="aspect-square object-cover w-full h-full rounded-lg"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
          {/* Genre Name */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-lg font-bold">{genre.name}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GenreCard;
