import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    const { songsIds, playlistId }: { songsIds: string[]; playlistId: string } =
      body;

    if (!songsIds) {
      return NextResponse.json(
        { error: "songsIds is required" },
        { status: 400 }
      );
    }

    if (!playlistId) {
      return NextResponse.json(
        { error: "playlistId is required" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.update({
      where: {
        id: playlistId,
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
      playlist,
    });
  } catch (error) {
    return NextResponse.json(
      // { error: (error as Error).message },
      { error: "An error occurred, fix your shit" },
      { status: 400 }
    );
  }
}
