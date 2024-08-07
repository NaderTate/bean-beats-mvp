import React from "react";
import ArtistCard from "./artist-card";

type Props = {
  shopId: string;
  artists: { name: string; image: string; id: string }[];
};

const Artrists = ({ artists, shopId }: Props) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 justify-start">
      {artists.map((artist) => (
        <ArtistCard key={artist.name} artist={artist} shopId={shopId} />
      ))}
    </div>
  );
};

export default Artrists;
