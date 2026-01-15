/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { assignFormateur } from '@/src/services/espace-pedagogique.service'
import { assignFormateurSchema } from '@/src/schemas/assign-formateur.schema'
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

// ✅ POST /api/v1/espace-pedagogique/assign-formateur
export async function POST(req: NextRequest) {
  try {
    // 🔐 Vérifier que l'utilisateur est Directeur des Études
    requireRole(req, ['DIRECTEUR_ETUDES'])

    // 📦 Parser et valider le body
    const body = await req.json()
    const data = assignFormateurSchema.parse(body)

    // 🧠 Affecter le formateur à l’espace pédagogique
    const result = await assignFormateur(
      data.espacePedagogiqueId,
      data.formateurId
    )

    return NextResponse.json(
      {
        success: true,
        message: result.message,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    )
  } catch (e: any) {
    let status = 400
    let error = e.message

    // 🔐 Authentification
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

    if (e.message === 'FORMATEUR_NOT_FOUND') {
      status = 404
      error = 'Formateur introuvable'
    }

    // 🧾 Validation Zod
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
