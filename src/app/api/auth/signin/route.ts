import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as jose from "jose";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();

    // check user credentials and return the token
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET as string
    );

    const token = await new jose.SignJWT({ userId: user.id, email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    const userShop = await prisma.coffeeShop.findFirst({
      where: { adminId: user.id },
    });

    return NextResponse.json(
      { token, coffeeShop: userShop, user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
