import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/coffee-shops/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const shop = await prisma.coffeeShop.findUnique({
      where: { id: id },
      include: { admin: true },
    });

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

// PATCH /api/coffee-shops/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;
    const body = await request.json();

    const shop = await prisma.coffeeShop.update({
      where: { id: id },
      data: body,
    });

    return NextResponse.json(shop);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
