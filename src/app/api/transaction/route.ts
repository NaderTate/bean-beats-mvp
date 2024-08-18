import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    shopId,
    songsIds,
    tableNumber,
  }: {
    shopId: string;
    songsIds: string[];
    tableNumber: number;
  } = body;
  if (!songsIds || songsIds.length === 0) {
    return NextResponse.json(
      { error: "songsIds is required and can't be empty" },
      { status: 400 }
    );
  }

  if (!shopId) {
    return NextResponse.json({ error: "shopId is required" }, { status: 400 });
  }

  if (!tableNumber) {
    return NextResponse.json(
      { error: "tableNumber is required" },
      { status: 400 }
    );
  }

  try {
    const songs = await prisma.songCoffeeShop.findMany({
      where: {
        coffeeShopId: shopId,
        songId: {
          in: songsIds,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    const amount = songs.reduce((acc, song) => acc + song.price, 0);

    const transaction = await prisma.transaction.create({
      data: {
        status: "COMPLETED",
        amount,
        shop: {
          connect: {
            id: shopId,
          },
        },
        songs: {
          connect: songs.map((song) => ({ id: song.id })),
        },
        tableNumber,
      },
    });

    if (!transaction) {
      return NextResponse.json({
        success: false,
        message: "Failed to create transaction",
      });
    }

    const addedSongsToQueue = await prisma.queueSong.createMany({
      data: songs.map((song) => ({
        songId: song.id,
        coffeeShopId: shopId,
        transactionId: transaction.id,
      })),
    });

    if (!addedSongsToQueue) {
      return NextResponse.json({
        success: false,
        message: "Failed to add songs to queue",
      });
    }

    return NextResponse.json({ success: true, transaction, addedSongsToQueue });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
