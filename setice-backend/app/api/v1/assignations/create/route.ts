/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { assignTravail } from '@/src/services/assignation.service'
import { travailRepository } from '@/src/repositories/travail.repository'
import { etudiantRepository } from '@/src/repositories/etudiant.repository'
import { Role } from '@/src/entities/User'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://relaxed-selkie-3ef8a0.netlify.app',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  console.log('✅ OPTIONS /api/v1/assignations/create called')
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED')
  return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
}

// app/api/v1/assignations/create/route.ts

export async function POST(req: NextRequest) {
  console.log('🟢 POST /api/v1/assignations/create called')
  
  try {
    console.log('1️⃣ Extracting formateur from token...')
    const formateurJWT = getUser(req)
    console.log('✅ Formateur JWT:', formateurJWT)

    if (formateurJWT.role !== Role.FORMATEUR) {
      console.log('❌ FORBIDDEN: User is not FORMATEUR')
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403, headers: CORS_HEADERS }
      )
    }

    console.log('2️⃣ Parsing request body...')
    const body = await req.json()
    console.log('✅ Request body:', body)
    
    const { travailId, etudiantId } = body

    if (!travailId || !etudiantId) {
      console.log('❌ MISSING_FIELDS:', { travailId, etudiantId })
      return NextResponse.json(
        { success: false, error: 'MISSING_FIELDS' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    console.log('3️⃣ Fetching travail...', travailId)
    const travail = await travailRepository.findById(travailId)
    if (!travail) {
      console.log('❌ TRAVAIL_NOT_FOUND')
      throw new Error('TRAVAIL_NOT_FOUND')
    }
    console.log('✅ Travail found:', travail.id, travail.titre)

    console.log('4️⃣ Fetching etudiant...', etudiantId)
    const etudiant = await etudiantRepository.findById(etudiantId)
    if (!etudiant) {
      console.log('❌ ETUDIANT_NOT_FOUND')
      throw new Error('ETUDIANT_NOT_FOUND')
    }
    console.log('✅ Etudiant found:', etudiant.id, etudiant.matricule)

    console.log('5️⃣ Creating assignation...')
    const assignation = await assignTravail({
      travail,
      etudiant,
      formateur: travail.formateur, // ✅ Utilisez le formateur du travail
    })
    console.log('✅ Assignation created:', assignation.id)

    return NextResponse.json(
      { success: true, data: assignation },
      { headers: CORS_HEADERS }
    )
  } catch (err: any) {
    console.error('❌ CREATE ASSIGNATION ERROR:', err)
    console.error('Stack trace:', err.stack)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400, headers: CORS_HEADERS }
    )
  }
}