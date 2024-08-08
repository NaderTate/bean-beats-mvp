import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET /api/album/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  try {
    const album = await prisma.album.findUnique({
      where: {
        id: id,
      },
      include: {
        artist: true,
        Song: true,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

// PUT /api/album/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const body = await request.json();

  const { name, year, image, artistId } = body;

  try {
    const album = await prisma.album.update({
      where: {
        id: id,
      },
      data: {
        artistId,
        name,
        year,
        image,
      },
    });
    revalidatePath("/dashboard/music");
    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

// DELETE /api/album/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  try {
    const album = await prisma.album.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
