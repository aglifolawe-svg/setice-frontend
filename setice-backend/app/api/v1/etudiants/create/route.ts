/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createEtudiant, getEtudiants } from '@/src/services/etudiant.service'
import { createEtudiantSchema } from '@/src/schemas/etudiant.schema'

const JWT_SECRET = process.env.JWT_SECRET!


export async function GET(req: NextRequest) {
  try {
    const etudiants = await getEtudiants()
    
    // ✅ Adapter pour le frontend (structure imbriquée)
    const adaptedEtudiants = etudiants.map(e => ({
      id: e.id,
      matricule: e.matricule,
      actif: e.actif,
      user: {
        id: e.userId,
        nom: e.nom,
        prenom: e.prenom,
        email: e.email,
        role: e.role,
      },
      promotion: {
        id: e.promotionId,
        code: e.promotionCode,
        libelle: e.promotionLibelle,
        annee: e.promotionAnnee,
      },
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }))
    
    return NextResponse.json(
      { success: true, data: adaptedEtudiants },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('GET ETUDIANTS ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET)

    const body = await req.json()
    const data = createEtudiantSchema.parse(body)
    const etudiant = await createEtudiant(data)

    // ✅ Adapter pour le frontend (structure imbriquée)
    const adaptedEtudiant = {
      id: etudiant.id,
      matricule: etudiant.matricule,
      actif: false, // Nouveau compte
      user: {
        id: etudiant.userId,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        role: etudiant.role,
        motDePasseTemporaire: etudiant.motDePasseTemporaire,
        temporaryPassword: etudiant.temporaryPassword,
      },
      promotion: {
        id: etudiant.promotionId,
        code: etudiant.promotionCode,
        libelle: etudiant.promotionLibelle,
        annee: etudiant.promotionAnnee,
      },
    }

    return NextResponse.json(
      { success: true, data: adaptedEtudiant },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('CREATE ETUDIANT ERROR:', err)

    let status = 400
    if (err.message === 'USER_ALREADY_EXISTS') status = 409
    if (err.message === 'PROMOTION_NOT_FOUND') status = 404
    if (err.message === 'jwt expired' || err.message === 'jwt malformed') status = 401

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}