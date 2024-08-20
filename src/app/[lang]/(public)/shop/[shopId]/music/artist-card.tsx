import Image from "next/image";
import Link from "next/link";

import useGetLang from "@/hooks/use-get-lang";

type Props = {
  artist: { name: string; image: string; id: string };
  shopId: string;
};

const ArtistCard = ({ artist, shopId }: Props) => {
  const { lang } = useGetLang();

  return (
    <div>
      <Link href={`/${lang}/shop/${shopId}/artists/${artist.id}`}>
        <Image
          width={150}
          height={150}
          alt={artist.name}
          src={artist.image}
          className=" object-top aspect-square rounded-full object-cover mx-auto"
        />
      </Link>
      <h3 className="text-gray-500 mt-5 text-center">{artist.name}</h3>
    </div>
  );
};

export default ArtistCard;
