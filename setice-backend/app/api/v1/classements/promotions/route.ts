import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { Role } from '@/src/entities/User'
import { getClassementPromotions } from '@/src/services/classement.service'

const JWT_SECRET = process.env.JWT_SECRET!


function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
}

export async function GET(req: NextRequest) {
  console.log('🟢 GET /api/v1/classements/promotions called')

  try {
    console.log('1️⃣ Extracting user from token...')
    const user = getUser(req)
    console.log('✅ User:', user.email, '- Role:', user.role)

    if (user.role !== Role.DIRECTEUR_ETUDES) {
      console.log('❌ FORBIDDEN: User is not DIRECTEUR_ETUDES')
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    console.log('2️⃣ Fetching classement des promotions...')
    const classement = await getClassementPromotions()
    console.log('✅ Classement calculé:', classement.length, 'promotions')

    return NextResponse.json(
      { success: true, data: classement }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ GET CLASSEMENT PROMOTIONS ERROR:', err)
    console.error('Stack trace:', err.stack)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}