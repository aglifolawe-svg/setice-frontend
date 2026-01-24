/* eslint-disable @typescript-eslint/no-explicit-any */
// ❌ SUPPRIMEZ CETTE LIGNE
// "use server"

export const runtime = 'nodejs'  // ✅ Ajoutez ceci à la place
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from "next/server"
import { createMatiere, listMatieres } from "@/src/services/matiere.service"
import { createMatiereSchema } from "@/src/schemas/matiere.schema"

export async function GET(req: NextRequest) {
  try {
    const matieres = await listMatieres()
    return NextResponse.json(
      { success: true, data: matieres },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = createMatiereSchema.parse(body)
    const matiere = await createMatiere(data)

    return NextResponse.json(
      { success: true, data: matiere },
      { status: 201 }
    )
  } catch (err: any) {
    let status = 400
    if (err.message === "MATIERE_ALREADY_EXISTS") status = 409

    return NextResponse.json(
      { success: false, error: err.message },
      { status }
    )
  }
}