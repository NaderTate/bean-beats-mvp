import { NextResponse, NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/album
export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json()

  const { name, year, image, artistId } = body

  try {
    const song = await prisma.album.create({
      data: {
        name,
        year,
        image,
        artistId,
      },
    })
    return NextResponse.json(song)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    )
  }
}

// GET /api/album
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParameters = request.nextUrl.searchParams
    let limit = searchParameters.get('limit') as string
    let skip = searchParameters.get('skip') as string
    let artistId = searchParameters.get('artistId') as string

    const albums = await prisma.album.findMany({
      take: parseInt(limit) || 20,
      skip: parseInt(skip) || 0,
      where: {
        artistId: artistId || undefined,
      },
    })
    return NextResponse.json(albums)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    )
  }
}
