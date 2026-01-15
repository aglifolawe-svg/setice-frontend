"use client"

import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDataSource } from "@/src/lib/db"
import { User } from "@/src/entities/User"
import { hashPassword } from "@/src/lib/password"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "super-secret-key"

interface ActivatePayload {
  userId: string
  temporaryPassword: string
  newPassword: string
}

// ✅ Gestion de CORS pour ce endpoint
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    },
  })
}

// POST /api/v1/etudiants/activate
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, newPassword } = body as { token: string; newPassword: string }

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing token or new password" }, { status: 400 })
    }

    // Vérifier le token
    let payload: ActivatePayload
    try {
      payload = jwt.verify(token, JWT_SECRET) as ActivatePayload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return NextResponse.json({ success: false, error: "Token invalide ou expiré" }, { status: 401 })
    }

    const db = await getDataSource()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id: payload.userId } })
    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 })
    }

    // Vérifier que le mot de passe temporaire correspond (optionnel si tu l’as stocké)
    if (!user.motDePasseTemporaire) {
      return NextResponse.json({ success: false, error: "Le compte est déjà activé" }, { status: 400 })
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword)
    user.password = hashedPassword
    user.motDePasseTemporaire = false
    await userRepo.save(user)

    return NextResponse.json({ success: true, message: "Compte activé avec succès, mot de passe mis à jour !" }, { status: 200 })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("ACTIVATE ETUDIANT ERROR:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
