import { Playlist } from "@prisma/client";
import React from "react";

type Props = { playlists: Playlist[] };

const PlaylistsMain = ({ playlists }: Props) => {
  return <div>PlaylistsMain</div>;
};

export default PlaylistsMain;
