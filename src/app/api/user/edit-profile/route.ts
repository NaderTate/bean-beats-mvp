import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const {
    id,
    name,
    email,
    phoneNumber,
    image,
    password,
  }: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    image: string;
    password: string;
  } = body;

  try {
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const hashedPassword = password && (await bcrypt.hash(password, 10));
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        phoneNumber,
        image,
        password: hashedPassword ?? undefined,
      },
    });
    return NextResponse.json({ message: "User updated successfully", user });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating user" },
      { status: 500 }
    );
  }
}
