import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

// POST /api/auth/signup
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email: body.email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User Already Exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        ...body,
        password: hashedPassword,
      },
    })

    await prisma.coffeeShop.create({
      data: {
        name: 'My Shop',
        adminId: user.id,
        address: 'My Address',
        revenueShare: 0.1,
        workingHours: {
          create: {
            day: 'Monday',
            open: '08:00',
            close: '18:00',
          },
        },
      },
    })

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
