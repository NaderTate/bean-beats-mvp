import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { songId, coffeeShopId, transactionId } = body;

  try {
    const queueSong = await prisma.queueSong.create({
      data: {
        song: {
          connect: {
            id: songId,
          },
        },
        CoffeeShop: {
          connect: {
            id: coffeeShopId,
          },
        },
        Transaction: {
          connect: {
            id: transactionId,
          },
        },
      },
    });
    if (queueSong) {
      return NextResponse.json({ success: true, queueSong });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to add song to queue",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
