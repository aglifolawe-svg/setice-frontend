/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createPromotion, getPromotions } from '@/src/services/promotion.service'
import { createPromotionSchema } from '@/src/schemas/promotion.schema'

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

// ✅ GET /api/v1/promotions
export async function GET(req: NextRequest) {
  try {
    const promotions = await getPromotions()
    return NextResponse.json(
      { success: true, data: promotions },
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
    console.error('GET PROMOTIONS ERROR:', err)
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

// ✅ POST /api/v1/promotions/create
export async function POST(req: NextRequest) {
  try {
    // Vérifier le token JWT
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
          },
        }
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    // Valider le body
    const body = await req.json()
    const data = createPromotionSchema.parse(body)

    // Créer la promotion
    const promotion = await createPromotion(data)

    return NextResponse.json(
      { success: true, data: promotion },
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
    console.error('CREATE PROMOTION ERROR:', err)

    let status = 400
    if (err.message === 'PROMOTION_ALREADY_EXISTS') status = 409
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
