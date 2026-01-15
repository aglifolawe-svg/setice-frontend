/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs' // ou "nodejs" si tu préfères
import { NextRequest, NextResponse } from "next/server"
import { getEspacePedagogique } from "@/src/services/espace-pedagogique.service"
import { requireRole } from "@/src/middleware/auth.middleware"

// CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
}

// Pré-requête OPTIONS
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}

// GET /api/v1/espaces-pedagogique/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérifier que l'utilisateur a le rôle Directeur des Études
    requireRole(req, ["DIRECTEUR_ETUDES"])

    // Récupérer l'espace par son id
    const espace = await getEspacePedagogique(params.id)

    if (!espace) {
      return NextResponse.json({ success: false, error: "Espace pédagogique introuvable" }, { status: 404, headers: corsHeaders })
    }

    return NextResponse.json({ success: true, data: espace }, { status: 200, headers: corsHeaders })
  } catch (e: any) {
    let status = 400
    const error = e.message

    if (e.message === "MISSING_TOKEN") status = 401
    if (e.message === "INVALID_TOKEN" || e.message === "INVALID_TOKEN_FORMAT") status = 401
    if (e.message === "FORBIDDEN") status = 403

    return NextResponse.json({ success: false, error }, { status, headers: corsHeaders })
  }
}
