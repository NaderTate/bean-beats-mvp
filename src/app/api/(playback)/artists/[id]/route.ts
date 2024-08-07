import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/artist/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  try {
    const artist = await prisma.artist.findUnique({
      where: {
        id: id,
      },
      include: {
        Song: true,
        Album: true,
      },
    });

    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

// PUT /api/artist/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const body = await request.json();

  const { name, image } = body;

  try {
    const artist = await prisma.artist.update({
      where: {
        id: id,
      },
      data: {
        name,
        image,
      },
    });

    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

// DELETE /api/artist/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;

  try {
    const artist = await prisma.artist.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}
