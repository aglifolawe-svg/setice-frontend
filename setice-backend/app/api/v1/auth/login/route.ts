export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { login } from '@/src/services/auth.service'
import { loginSchema } from '@/src/schemas/login.schema'

// Pour gérer la pré-requête CORS
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = loginSchema.parse(body)

    const result = await login(data.email, data.password)

    return NextResponse.json(
      { success: true, data: result },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e.message === 'INVALID_CREDENTIALS') {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
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

    if (e.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: JSON.stringify(e.errors) },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
          },
        }
      )
    }

    return NextResponse.json(
      { success: false, error: e.message },
      {
        status: 400,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    )
  }
}
