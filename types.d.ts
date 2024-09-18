type ExtendedAlbum = {
  artist: {
    name: string;
  } | null;
  _count: {
    Song: number;
  };
} & {
  id: string;
  name: string;
  year: number | null;
  image: string;
  artistId: string | null;
  coffeeShopsIds: string[];
};

type Lang = "en" | "ar";

type height = "sm" | "md" | "lg" | "screen";
