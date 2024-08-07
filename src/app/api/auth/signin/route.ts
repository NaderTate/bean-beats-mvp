import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest): Promise<NextResponse> { 
    try {
        
        const { email, password } = await request.json();
        
        // check user credentials and return the token
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' }, { status: 400 }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                { error: 'Invalid credentials' }, { status: 401 }
            );
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' }, { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.NEXTAUTH_SECRET as string,
            { expiresIn: '30D' }
        );

        const userShop = await prisma.coffeeShop.findFirst({
            where: { adminId: user.id }
        });

        return NextResponse.json(
            { token, coffeeShop: userShop },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}
