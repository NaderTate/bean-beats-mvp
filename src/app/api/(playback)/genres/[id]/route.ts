import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const genre = await prisma.genre.findUnique({
      where: {
        id,
      },
      include: {
        songs: {
          include: {
            artist: true,
          },
        },
      },
    });

    if (!genre) {
      return NextResponse.json({ error: "Genre not found" }, { status: 404 });
    }
    return NextResponse.json(genre);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
