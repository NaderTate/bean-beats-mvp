import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params: { shopId } }: { params: { shopId: string } }
) {
  try {
    // get the first song in the queue
    const song = await prisma.queueSong.findFirst({
      where: {
        coffeeShopId: shopId,
      },
      orderBy: {
        id: "asc",
      },
    });

    if (!song) {
      return NextResponse.json(
        { message: "No songs in the queue" },
        { status: 404 }
      );
    }

    // remove the song from the queue
    await prisma.queueSong.delete({
      where: {
        id: song.id,
      },
    });

    // get the updated queue
    const queue = await prisma.queueSong.findMany({
      where: {
        coffeeShopId: shopId,
      },
      include: {
        song: true,
      },
    });

    // return the next 2 songs in the queue
    const nextSongs = queue.slice(0, 2);

    return NextResponse.json(nextSongs);
  } catch (error) {
    console.error("Error fetching or processing the queue:", error);
    return NextResponse.json(
      { message: "An error occurred while processing the queue" },
      { status: 500 }
    );
  }
}
