import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PlaylistType } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const {
    name,
    shopId,
    sognsIds,
    type,
  }: { name: string; shopId: string; sognsIds: string[]; type: PlaylistType } =
    body;

  // if type of type is not PlaylistType, return error
  try {
    if (!Object.values(PlaylistType).includes(type)) {
      return NextResponse.json(
        { error: "Invalid playlist type" },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!shopId) {
      return NextResponse.json(
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        shopId,
        songs: {
          connect: sognsIds.map((id) => ({ id })),
        },
      },
    });
    setTimeout(() => {
      revalidatePath("/dashboard/music");
    }, 1000);
    return NextResponse.json({
      created: true,
      playlist,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParameters = request.nextUrl.searchParams;
    const shopId = searchParameters.get("shopId");
    const playlists = await prisma.playlist.findMany({
      where: {
        shopId: shopId ?? undefined,
      },
      include: {
        songs: {
          select: { thumbnail: true },
          take: 4,
          orderBy: { id: "desc" },
        },
      },
    });

    const placeholderImages = [
      "https://files.catbox.moe/f1y8eg.jpg",
      "https://files.catbox.moe/bfzzwk.jpg",
      "https://files.catbox.moe/pbldi9.jpg",
      "https://files.catbox.moe/ycynho.webp",
    ];

    const playlistsWithPlaceholders = playlists.map((playlist) => {
      const songThumbnails = playlist.songs.map((song) => song.thumbnail);
      const placeholdersNeeded = Math.max(
        0,
        placeholderImages.length - songThumbnails.length
      );

      return {
        ...playlist,
        songs: [
          ...playlist.songs,
          ...placeholderImages
            .slice(0, placeholdersNeeded)
            .map((thumbnail) => ({ thumbnail })),
        ],
      };
    });

    return NextResponse.json(playlistsWithPlaceholders);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
