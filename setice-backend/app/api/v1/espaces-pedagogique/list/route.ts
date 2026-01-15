export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { listEspacesPedagogiques } from '@/src/services/espace-pedagogique.service'
import { requireRole } from '@/src/middleware/auth.middleware'

// 🔹 Headers CORS communs
const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
}

// ✅ Pré-requête CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// ✅ GET /api/v1/espace-pedagogique
export async function GET(req: NextRequest) {
  try {
    // 🔐 Vérifier que l'utilisateur est Directeur des Études
    requireRole(req, ['DIRECTEUR_ETUDES'])

    // 📦 Récupérer tous les espaces pédagogiques
    const espaces = await listEspacesPedagogiques()

    // 🧾 Formater la réponse
    const data = espaces.map(espace => ({
      id: espace.id,
      promotion: {
        id: espace.promotion.id,
        code: espace.promotion.code,
        libelle: espace.promotion.libelle,
        annee: espace.promotion.annee,
      },
      matiere: {
        id: espace.matiere.id,
        libelle: espace.matiere.libelle,
      },
      formateur: espace.formateur
        ? {
            id: espace.formateur.id,
            nom: espace.formateur.user?.nom,
            prenom: espace.formateur.user?.prenom,
          }
        : null,

      etudiants: espace.etudiants?.map(e => ({
    id: e.id,
    matricule: e.matricule,
    user: {
      id: e.user.id,
      prenom: e.user.prenom,
      nom: e.user.nom,
      email: e.user.email,
    },
  })) ?? [],
createdAt: espace.createdAt,


    }))

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: corsHeaders,
      }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    let status = 400
    let error = e.message

    // 🔐 Auth
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

    return NextResponse.json(
      { success: false, error },
      {
        status,
        headers: corsHeaders,
      }
    )
  }
}
