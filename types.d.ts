type ExtendedAlbum = {
  artist: {
    name: string;
  } | null;
  _count: {
    Song: number;
  };
  Song: Song[];
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

interface MapLocation {
  lat: number;
  lng: number;
}

type timeInterval =
  | "last7days"
  | "last30days"
  | "last3months"
  | "last6months"
  | "lastYear";
