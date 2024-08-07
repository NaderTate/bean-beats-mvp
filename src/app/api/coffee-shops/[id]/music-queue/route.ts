import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/coffee-shops/:id/music-queue
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    // const shop = await prisma.coffeeShop.findUnique({
    //     where: { id: id },
    //     include: { playingQueue: true }
    // });
    const queue = await prisma.queueSong.findMany({
      where: {
        coffeeShopId: id,
      },
      include: {
        song: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            artist: { select: { name: true } },
            duration: true,
            fileURL: true,
          },
        },
      },
    });

    return NextResponse.json(queue);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
