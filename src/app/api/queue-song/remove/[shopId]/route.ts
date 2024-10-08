import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params: { shopId } }: { params: { shopId: string } }) {
  try {
    const song = await prisma.queueSong.findFirst({
      where: {
        coffeeShopId: shopId,
      },
      orderBy: {
        id: 'asc',
      },
    })

    if (!song) {
      return NextResponse.json({ message: 'No songs in the queue' }, { status: 404 })
    }

    // remove the song from the queue
    await prisma.queueSong.delete({
      where: {
        id: song.id,
      },
    })

    return NextResponse.json('Song removed from queue')
  } catch (error) {
    console.error('Error fetching or processing the queue:', error)
    return NextResponse.json({ message: 'An error occurred while processing the queue' }, { status: 500 })
  }
}
