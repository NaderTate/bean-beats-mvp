"use client";

import { Genre } from "@prisma/client";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
type Props = { genres: Genre[]; shopId: string; lang: string };

const Genres = ({ genres, shopId, lang }: Props) => {
  const t = useTranslations();

  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-xl mt-5 mb-3 text-primary-500">
          {t("Genres")}
        </h3>
        {genres.length > 7 && (
          <Link
            className="text-primary"
            href={`/${lang}/shop/${shopId}/music/genres`}
          >
            {t("See All")}
          </Link>
        )}
      </div>
      <Swiper
        spaceBetween={20} // Adjust space between slides as needed
        slidesPerView="auto"
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {genres.slice(0, 7).map((genre) => (
          <SwiperSlide
            key={genre.id}
            style={{ width: "200px" }} // Set fixed width for each slide
          >
            <div className="relative w-[200px] h-[200px]">
              <Link href={`/${lang}/shop/${shopId}/music/genre/${genre.id}`}>
                {/* Back card 2 */}
                <div className="absolute top-3 left-3 w-full h-full bg-gray-100 rounded-lg border"></div>
                {/* Back card 1 */}
                <div className="absolute top-1 left-1 w-full h-full bg-gray-200 rounded-lg border"></div>
                {/* Front card (Genre Image) */}
                <div className="relative">
                  <Image
                    src={genre.image}
                    width={200}
                    height={200}
                    alt={genre.name}
                    className="aspect-square object-cover w-full h-full rounded-lg"
                  />
                </div>
              </Link>
            </div>
            <h3 className="mt-4 text-primary font-medium text-left">
              {genre.name}
            </h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Genres;
