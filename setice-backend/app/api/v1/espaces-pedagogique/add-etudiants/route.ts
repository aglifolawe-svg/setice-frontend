export const runtime = 'nodejs'

/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import { addEtudiantsFromPromotion, getEspacePedagogique } from '@/src/services/espace-pedagogique.service'
import { addEtudiantsSchema } from '@/src/schemas/add-etudiants.schema'
import { requireRole } from '@/src/middleware/auth.middleware'

// 🔹 Headers CORS communs
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

// ✅ Pré-requête CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// ✅ POST /api/v1/espace-pedagogique/add-etudiants
export async function POST(req: NextRequest) {
  try {
    // 🔐 Vérifier que l'utilisateur est Directeur des Études
    requireRole(req, ['DIRECTEUR_ETUDES'])

    // 📦 Parser et valider le body
    const body = await req.json()
    const data = addEtudiantsSchema.parse(body)

    // 🧠 Inscrire les étudiants de la promotion
    const result = await addEtudiantsFromPromotion(
      data.espacePedagogiqueId,
      data.promotionId
    )

    return NextResponse.json(
      {
        success: true,
        message: result.message,
        data: result.data,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    )
  } catch (e: any) {
    let status = 400
    let error = e.message

    // 🔐 Erreurs d’authentification
    if (e.message === 'MISSING_TOKEN') {
      status = 401
      error = 'Token manquant'
    }

    if (e.message === 'INVALID_TOKEN' || e.message === 'INVALID_TOKEN_FORMAT') {
      status = 401
      error = 'Token invalide'
    }

    if (e.message === 'FORBIDDEN') {
      status = 403
      error = 'Accès refusé - Réservé au Directeur des Études'
    }

    // 📚 Erreurs métier
    if (e.message === 'ESPACE_NOT_FOUND') {
      status = 404
      error = 'Espace pédagogique introuvable'
    }

    if (e.message === 'PROMOTION_NOT_FOUND') {
      status = 404
      error = 'Promotion introuvable'
    }

    if (e.message === 'NO_STUDENTS_IN_PROMOTION') {
      status = 404
      error = 'Aucun étudiant dans cette promotion'
    }

    // 🧾 Erreur Zod
    if (e.name === 'ZodError') {
      status = 400
      error = JSON.stringify(e.errors)
    }

    return NextResponse.json(
      { success: false, error },
      {
        status,
        headers: corsHeaders,
      }
    )
  }
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const espace = await getEspacePedagogique(params.id)

  return NextResponse.json({
    success: true,
    data: espace,
  })
}
