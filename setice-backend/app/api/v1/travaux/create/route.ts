/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createTravailSchema } from '@/src/schemas/createTravail.schema'
import { createTravail} from '@/src/services/travail.service'
import { User } from '@/src/entities/User'

const JWT_SECRET = process.env.JWT_SECRET!


async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('UNAUTHORIZED')
  }

  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)

    if (user.role !== 'FORMATEUR') {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = createTravailSchema.parse(body)

    const travail = await createTravail({
      ...data,
      formateur: {
        id: user.userId,
        role: user.role,
      } as User,
      espacePedagogiqueId: data.espacePedagogiqueId,
    })

    return NextResponse.json(
      { success: true, data: travail },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('CREATE TRAVAIL ERROR:', err)

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    )
  }
}