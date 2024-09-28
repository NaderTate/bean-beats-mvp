import { Artist, CoffeeShop, Song } from "@prisma/client";

import ShopInfo from "./shop-info";
import SongPlayer from "./music-player";

interface FullSong extends Song {
  Artist: Artist | null;
}
type Props = {
  shop: CoffeeShop;
  table: string;
  currentPlayingSong: FullSong | undefined;
};

const Main = ({ shop, table, currentPlayingSong }: Props) => {
  return (
    <div className="mt-20 px-4 sm:px-6 lg:px-8 py-8">
      <ShopInfo
        name={shop.name}
        address={shop.location || ""}
        table={table}
        currentPlayingSong={currentPlayingSong}
      />
      <SongPlayer song={currentPlayingSong} />
    </div>
  );
};

export default Main;
