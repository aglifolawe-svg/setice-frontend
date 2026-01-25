/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { evaluateTravailSchema } from '@/src/schemas/evaluateTravail.schema'
import { evaluateTravail } from '@/src/services/evaluation.service'

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
    console.log("")
    console.log("🔵 [API] ========================================")
    console.log("🔵 [API] POST /api/v1/evaluations/create")
    console.log("🔵 [API] ========================================")

    const user = await getUserFromToken(req)
    console.log("👤 [API] Utilisateur:", { id: user.id, userId: user.userId, role: user.role })

    if (user.role !== 'FORMATEUR') {
      console.error("❌ [API] FORBIDDEN - L'utilisateur n'est pas formateur")
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN: Seuls les formateurs peuvent évaluer' },
        { status: 403 }
      )
    }

    const body = await req.json()
    console.log("📥 [API] Body reçu:", body)

    const data = evaluateTravailSchema.parse(body)
    console.log("✅ [API] Validation réussie:", data)

    const evaluation = await evaluateTravail({ ...data, formateur: user })
    console.log("✅ [API] Évaluation créée:", {
      id: evaluation.id,
      note: evaluation.note,
      assignationId: data.assignationId
    })

    return NextResponse.json(
      { success: true, data: evaluation },
      { status: 201 }
    )
  } catch (err: any) {
    console.error("❌ [API] EVALUATE TRAVAIL ERROR:", err)
    console.error("❌ [API] Stack:", err.stack)

    return NextResponse.json(
      { success: false, error: err.message || 'Erreur lors de la création de l\'évaluation' },
      { status: 400 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    console.log("")
    console.log("🔵 [API] ========================================")
    console.log("🔵 [API] GET /api/v1/evaluations/create")
    console.log("🔵 [API] ========================================")

    const url = new URL(req.url)
    const assignationId = url.searchParams.get('assignationId')

    console.log("📥 [API] Params:", { assignationId })

    if (!assignationId) {
      console.error("❌ [API] ASSIGNATION_ID_REQUIRED")
      return NextResponse.json(
        { success: false, error: 'ASSIGNATION_ID_REQUIRED' },
        { status: 400 }
      )
    }

    const { evaluationRepository } = await import('@/src/repositories/evaluation.repository')
    const evaluations = await evaluationRepository.listByAssignation(assignationId)

    console.log("✅ [API] Évaluations trouvées:", evaluations.length)

    return NextResponse.json(
      { success: true, data: evaluations },
      { status: 200 }
    )
  } catch (err: any) {
    console.error("❌ [API] GET EVALUATIONS ERROR:", err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}