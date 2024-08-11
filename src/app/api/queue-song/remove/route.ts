import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { queueSongId, coffeeShopId } = await req.json();

  if (!queueSongId) {
    return NextResponse.json(
      { error: "queueSongId is required" },
      { status: 400 }
    );
  }

  if (!coffeeShopId) {
    return NextResponse.json(
      { error: "coffeeShopId is required" },
      { status: 400 }
    );
  }

  try {
    const queueSong = await prisma.queueSong.delete({
      where: {
        id: queueSongId,
      },
      include: {
        song: true,
      },
    });

    if (!queueSong) {
      throw new Error("Queue song not found");
    }
    const queue = await prisma.queueSong.findMany({
      where: {
        coffeeShopId,
      },
      include: {
        song: true,
      },
    });

    return NextResponse.json({ deleted: true, deletedSong: queueSong, queue });
  } catch (error: any) {
    if (error.code === "P2025") {
      // Prisma error code for record not found
      return NextResponse.json(
        { error: "Queue song not found" },
        { status: 404 }
      );
    } else {
      // Handle other errors (e.g., Prisma connection errors)
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
