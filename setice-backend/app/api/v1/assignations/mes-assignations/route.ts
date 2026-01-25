/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { listAssignationsByEtudiant } from '@/src/services/assignation.service'
import { Role } from '@/src/entities/User'

const JWT_SECRET = process.env.JWT_SECRET!


function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED')
  return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
}

export async function GET(req: NextRequest) {
  console.log('🟢 GET /api/v1/assignations/mes-assignations called')

  try {
    console.log('1️⃣ Extracting user from token...')
    const userJWT = getUser(req)
    console.log('✅ User JWT:', userJWT)

    if (userJWT.role !== Role.ETUDIANT) {
      console.log('❌ FORBIDDEN: User is not ETUDIANT')
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    console.log('2️⃣ Fetching assignations for student...', userJWT.id)
    const assignations = await listAssignationsByEtudiant(userJWT.id)
    console.log('✅ Assignations fetched:', assignations.length)

    return NextResponse.json(
      { success: true, data: assignations }
    )
  } catch (err: any) {
    console.error('❌ FETCH ASSIGNATIONS ERROR:', err)
    console.error('Stack trace:', err.stack)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    )
  }
}

export const runtime = 'nodejs'