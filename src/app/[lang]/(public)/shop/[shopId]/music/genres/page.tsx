import prisma from "@/lib/prisma";
import GenreCard from "./genre-card";
import GenresMain from "./main";

type GenresPageProps = { params: { shopId: string } };

const GenresPage = async ({ params: { shopId } }: GenresPageProps) => {
  const genres = await prisma.genre.findMany();

  return (
    <div className="mt-24 px-14">
      <GenresMain genres={genres} shopId={shopId} />
    </div>
  );
};

export default GenresPage;
