/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { assignationRepository } from '@/src/repositories/assignation.repository'
import { evaluationRepository } from '@/src/repositories/evaluation.repository'

const JWT_SECRET = process.env.JWT_SECRET!


async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)

    if (user.role !== 'ETUDIANT') {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const assignations = await assignationRepository.listByEtudiant(user.id)

    const evaluations = await Promise.all(
      assignations.map(async (assign: { id: string }) => {
        const evals = await evaluationRepository.listByAssignation(assign.id)
        return evals
      })
    )

    const allEvaluations = evaluations.flat()

    return NextResponse.json(
      { success: true, data: allEvaluations }
    )
  } catch (err: any) {
    console.error('GET MES EVALUATIONS ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}