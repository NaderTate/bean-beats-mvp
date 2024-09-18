import ArtistCard from "./artist-card";
import { useTranslations } from "next-intl";
import NotFound from "@/components/not-found";

type Props = {
  shopId: string;
  artists: { name: string; image: string; id: string }[];
  height?: height;
};

const Artrists = ({ artists, shopId, height }: Props) => {
  const t = useTranslations();
  if (!artists || artists.length === 0) {
    return <NotFound label="No artists found" height={height} />;
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
