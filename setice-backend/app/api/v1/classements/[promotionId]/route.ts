import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { Role } from '@/src/entities/User'
import { getClassementPromotion } from '@/src/services/classement.service'

const JWT_SECRET = process.env.JWT_SECRET!


function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ promotionId: string }> | { promotionId: string } }
) {
  console.log('🟢 GET /api/v1/classements/[promotionId] called')

  try {
    const user = getUser(req)
    console.log('✅ User:', user.email, '- Role:', user.role)

    if (user.role !== Role.DIRECTEUR_ETUDES) {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    let promotionId: string
    if (context.params instanceof Promise) {
      const params = await context.params
      promotionId = params.promotionId
    } else {
      promotionId = context.params.promotionId
    }

    console.log('2️⃣ Fetching classement for promotion:', promotionId)
    const result = await getClassementPromotion(promotionId)
    console.log('✅ Classement calculé:', result.classement.length, 'étudiants')

    return NextResponse.json(
      { success: true, data: result }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ GET CLASSEMENT PROMOTION ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}