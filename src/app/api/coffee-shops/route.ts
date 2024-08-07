import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/coffee-shops
export async function POST(request: NextRequest): Promise<NextResponse> { 
    try {
        const body = await request.json();

        const shop = await prisma.coffeeShop.create({
            data: body
        });

        return NextResponse.json(shop);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}

// GET /api/coffee-shops
export async function GET(request: NextRequest): Promise<NextResponse> { 
    try {
        const shops = await prisma.coffeeShop.findMany();

        return NextResponse.json(shops);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 400 }
        );
    }
}