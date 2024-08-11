import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET /api/song/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  try {
    const song = await prisma.song.findUnique({
      where: {
        id: id,
      },
      include: {
        album: {
          select: {
            name: true,
          },
        },
        artist: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

// PUT /api/song/:id
export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
): Promise<NextResponse> {
  const body = await request.json();
  console.log({ id });

  const { title, artistId, albumId, duration, price, fileURL } = body;

  try {
    const song = await prisma.song.update({
      where: {
        id: "66a8f1070d93c95693b5e2f5",
      },
      data: {
        title,
        artistId,
        albumId,
        duration,
        fileURL,
      },
    });
    revalidatePath("/dashboard/music");
    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

// DELETE /api/song/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  try {
    const song = await prisma.song.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
