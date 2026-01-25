/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { assignTravail } from '@/src/services/assignation.service'
import { travailRepository } from '@/src/repositories/travail.repository'
import { etudiantRepository } from '@/src/repositories/etudiant.repository'
import { Role } from '@/src/entities/User'

const JWT_SECRET = process.env.JWT_SECRET!


function getUser(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) throw new Error('UNAUTHORIZED')
  return jwt.verify(auth.split(' ')[1], JWT_SECRET) as any
}

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
        { status: 403 }
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
        { status: 400 }
      )
    }

    console.log('3️⃣ Fetching travail entity...')
    // ✅ Utiliser findByIdEntity pour récupérer l'entité complète
    const travail = await travailRepository.findByIdEntity(travailId)
    if (!travail) {
      console.log('❌ TRAVAIL_NOT_FOUND')
      return NextResponse.json(
        { success: false, error: 'TRAVAIL_NOT_FOUND' },
        { status: 404 }
      )
    }
    console.log('✅ Travail found:', travail.id, travail.titre)

    console.log('4️⃣ Fetching etudiant entity...')
    // ✅ Utiliser findByIdEntity pour récupérer l'entité complète
    const etudiant = await etudiantRepository.findByIdEntity(etudiantId)
    if (!etudiant) {
      console.log('❌ ETUDIANT_NOT_FOUND')
      return NextResponse.json(
        { success: false, error: 'ETUDIANT_NOT_FOUND' },
        { status: 404 }
      )
    }
    console.log('✅ Etudiant found:', etudiant.id, etudiant.matricule)

    console.log('5️⃣ Creating assignation...')
    const assignation = await assignTravail({
      travail,
      etudiant,
      formateur: travail.formateur,
    })
    console.log('✅ Assignation created:', assignation)

    // ✅ Retourner un objet PLAIN (pas l'entité directement)
    return NextResponse.json({
      success: true,
      data: assignation // assignTravail devrait déjà retourner un objet plain
    })
  } catch (err: any) {
    console.error('❌ CREATE ASSIGNATION ERROR:', err)
    console.error('Stack trace:', err.stack)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}