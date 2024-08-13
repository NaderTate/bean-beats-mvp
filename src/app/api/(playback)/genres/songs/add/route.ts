import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const { songsIds, genreId }: { songsIds: string[]; genreId: string } = body;

  if (!songsIds) {
    return NextResponse.json(
      { error: "songsIds is required" },
      { status: 400 }
    );
  }

  if (!genreId) {
    return NextResponse.json({ error: "genreId is required" }, { status: 400 });
  }

  try {
    const genre = await prisma.genre.update({
      where: {
        id: genreId,
      },
      data: {
        songs: {
          connect: songsIds.map((id) => ({ id })),
        },
      },
    });

    setTimeout(() => {
      revalidatePath("/dashboard/music");
    }, 1000);
    return NextResponse.json({
      added: true,
      genre,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
