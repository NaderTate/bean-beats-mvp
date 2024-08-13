import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const genres = await prisma.genre.findMany();
  return NextResponse.json(genres);
}
