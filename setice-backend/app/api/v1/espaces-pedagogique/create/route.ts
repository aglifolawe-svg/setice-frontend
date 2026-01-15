export const runtime = 'nodejs'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { createEspacePedagogique } from '@/src/services/espace-pedagogique.service'
import { createEspacePedagogiqueSchema } from '@/src/schemas/espace-pedagogique.schema'

// ✅ Pré-requête CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  })
}

// ✅ POST /api/v1/espace-pedagogique
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validation Zod
    const data = createEspacePedagogiqueSchema.parse(body)

    // Création
    const espace = await createEspacePedagogique(data)

    return NextResponse.json(
      { success: true, data: espace },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
      }
    )
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'POST,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
      }
    )
  }
}
