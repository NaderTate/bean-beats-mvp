import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PlaylistType } from "@prisma/client";
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
    const playlist = await prisma.playlist.findUnique({
      where: {
        id,
      },
      include: {
        songs: true,
      },
    });

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist not found" },
        { status: 404 }
      );
    }

    const placeholderImages = [
      "https://files.catbox.moe/f1y8eg.jpg",
      "https://files.catbox.moe/bfzzwk.jpg",
      "https://files.catbox.moe/pbldi9.jpg",
      "https://files.catbox.moe/ycynho.webp",
    ];

    const songThumbnails = playlist.songs.map((song) => song.thumbnail);
    const placeholdersNeeded = Math.max(
      0,
      placeholderImages.length - songThumbnails.length
    );

    const images = [
      ...songThumbnails,
      ...placeholderImages.slice(0, placeholdersNeeded),
    ];

    const playlistWithImagesField = {
      ...playlist,
      images,
    };

    return NextResponse.json(playlistWithImagesField);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  const body = await request.json();

  const {
    shopId,
    sognsIds,
    type,
  }: { name: string; shopId: string; sognsIds: string[]; type: PlaylistType } =
    body;

  // if type of type is not PlaylistType, return error
  if (type && !Object.values(PlaylistType).includes(type)) {
    return NextResponse.json(
      { error: "Invalid playlist type" },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  if (shopId) {
    const shop = await prisma.songCoffeeShop.findUnique({
      where: {
        id: shopId,
      },
    });

    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }
  }

  if (sognsIds && !Array.isArray(sognsIds)) {
    return NextResponse.json(
      { error: "Songs IDs should be an array" },
      { status: 400 }
    );
  }

  try {
    const playlist = await prisma.playlist.update({
      where: {
        id,
      },
      data: {
        ...body,
        songs: sognsIds
          ? {
              connect: sognsIds.map((id) => ({ id })),
            }
          : undefined,
      },
    });
    revalidatePath("/dashboard/music");
    return NextResponse.json({
      updated: true,
      playlist,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    await prisma.playlist.delete({
      where: {
        id,
      },
    });

    setTimeout(() => {
      revalidatePath("/dashboard/music");
      console.log("revalidatePath('/dashboard/music')");
    }, 1000);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
