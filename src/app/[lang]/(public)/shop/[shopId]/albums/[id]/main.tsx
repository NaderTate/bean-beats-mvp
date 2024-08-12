import { Album, Song } from "@prisma/client";
import React from "react";

type Props = { album: Album & { songs: Song[] } };

const Main = (props: Props) => {
  return <div>Main</div>;
};

export default Main;
