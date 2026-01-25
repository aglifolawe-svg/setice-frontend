/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createFormateur, getFormateurs } from '@/src/services/formateur.service'
import { createFormateurSchema } from '@/src/schemas/formateur.schema'

const JWT_SECRET = process.env.JWT_SECRET!


export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    const body = await req.json()
    const data = createFormateurSchema.parse(body)

    const formateur = await createFormateur(data)

    return NextResponse.json(
      { success: true, data: formateur },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('CREATE FORMATEUR ERROR:', err)

    let status = 400
    if (err.message === 'USER_ALREADY_EXISTS') status = 409
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const formateurs = await getFormateurs()
    return NextResponse.json(
      { success: true, data: formateurs },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("GET FORMATEURS ERROR:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}