import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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
          disconnect: songsIds.map((id) => ({ id })),
        },
      },
    });
    setTimeout(() => {
      revalidatePath("/dashboard/music");
    }, 1000);
    return NextResponse.json({
      removed: true,
      genre,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
