import Image from "next/image";
import ArtistCard from "./artist-card";
import { useTranslations } from "next-intl";

type Props = {
  shopId: string;
  artists: { name: string; image: string; id: string }[];
};

const Artrists = ({ artists, shopId }: Props) => {
  const t = useTranslations();
  if (!artists || artists.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <Image
          src="/images/not-found.svg"
          width={200}
          height={200}
          alt="not-found"
        />
        <h1>{t("No artists found")}</h1>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 justify-start">
      {artists.map((artist) => (
        <ArtistCard key={artist.name} artist={artist} shopId={shopId} />
      ))}
    </div>
  );
};

export default Artrists;
