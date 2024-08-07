import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { songId, coffeeShopId } = await req.json();
  const queueSong = await prisma.queueSong.findFirst({
    where: {
      songId,
      coffeeShopId,
    },
  });
  if (!queueSong) {
    return NextResponse.json(
      { error: "Queue song not found" },
      { status: 404 }
    );
  }
  await prisma.queueSong.delete({
    where: {
      id: queueSong.id,
    },
  });
  return NextResponse.json({ deleted: true, queueSong });
}
