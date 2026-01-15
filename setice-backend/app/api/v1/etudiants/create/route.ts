export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createEtudiant, getEtudiants } from '@/src/services/etudiant.service'
import { createEtudiantSchema } from '@/src/schemas/etudiant.schema'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

// ✅ Gestion de la pré-requête CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  })
}

// ✅ GET /api/v1/etudiants
export async function GET(req: NextRequest) {
  try {
    const etudiants = await getEtudiants()
    return NextResponse.json(
      { success: true, data: etudiants },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  } catch (err: any) {
    console.error('GET ETUDIANTS ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  }
}

// ✅ POST /api/v1/etudiants/create
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401, headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        }}
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    const body = await req.json()
    const data = createEtudiantSchema.parse(body)
    const etudiant = await createEtudiant(data)

    return NextResponse.json(
      { success: true, data: etudiant },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  } catch (err: any) {
    console.error('CREATE ETUDIANT ERROR:', err)

    let status = 400
    if (err.message === 'ETUDIANT_ALREADY_EXISTS') status = 409
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      {
        status,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  }
}
