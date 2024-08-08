import { NextPage } from "next";
import ArtistMain from "./main";

type ArtistPageProps = {};

const ArtistPage: NextPage = async ({}: ArtistPageProps) => {
  return (
    <>
      <ArtistMain />
    </>
  );
};

export default ArtistPage;
