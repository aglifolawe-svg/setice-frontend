/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDataSource } from "@/src/lib/db"
import { User } from "@/src/entities/User"
import { hashPassword } from "@/src/lib/password"
import { sendActivationEmail } from "@/src/lib/mail"

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "super-secret-key"

interface ActivatePayload {
  userId: string
  temporaryPassword: string
  newPassword: string
}

export async function POST(req: NextRequest) {
  console.log("")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🎯 [ACTIVATE] POST /api/v1/etudiants/activate")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  try {
    const body = await req.json()
    const { token, newPassword } = body as { token: string; newPassword: string }

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Missing token or new password" }, { status: 400 })
    }

    // Vérification du token
    let payload: ActivatePayload
    try {
      payload = jwt.verify(token, JWT_SECRET) as ActivatePayload
      console.log("✅ [ACTIVATE] Token valide - userId:", payload.userId)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return NextResponse.json({ success: false, error: "Token invalide ou expiré" }, { status: 401 })
    }

    // Recherche de l’utilisateur
    const db = await getDataSource()
    const userRepo = db.getRepository(User)
    const user = await userRepo.findOne({ where: { id: payload.userId } })

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 })
    }

    if (!user.motDePasseTemporaire) {
      return NextResponse.json({ success: false, error: "Le compte est déjà activé" }, { status: 400 })
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword)
    user.password = hashedPassword
    user.motDePasseTemporaire = false
    user.isActive = true
    await userRepo.save(user)
    console.log("✅ [ACTIVATE] Compte activé avec succès!")

    // --- Envoi de l’email via SendGrid ---
    try {
      await sendActivationEmail(user.email, payload.temporaryPassword, token)
    } catch (err: any) {
      console.error("❌ [ACTIVATE] Impossible d’envoyer l’email:", err.message || err)
      // On ne bloque pas l’activation même si l’email échoue
    }

    return NextResponse.json({ success: true, message: "Compte activé avec succès, email envoyé !" }, { status: 200 })

  } catch (err: any) {
    console.error("💥 [ACTIVATE] Erreur:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
