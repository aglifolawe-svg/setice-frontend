/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { getDataSource } from "@/src/lib/db"
import { User } from "@/src/entities/User"
import { hashPassword } from "@/src/lib/password"

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'super-secret-key'

interface ActivatePayload {
  userId: string
  type: string
}

export async function POST(req: NextRequest) {
  console.log("")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🎯 [ACTIVATE] POST /api/v1/auth/activate")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  try {
    const body = await req.json()
    const { token, newPassword } = body as { token: string; newPassword?: string }

    if (!token) {
      return NextResponse.json({ success: false, error: "Token manquant" }, { status: 400 })
    }

    // ✅ Vérification du token
    let payload: ActivatePayload
    try {
      payload = jwt.verify(token, JWT_SECRET) as ActivatePayload
      console.log("✅ [ACTIVATE] Token valide - userId:", payload.userId)
    } catch (err: any) {
      console.error("❌ [ACTIVATE] Token invalide:", err.message)
      return NextResponse.json({ success: false, error: "Token invalide ou expiré" }, { status: 401 })
    }

    // ✅ Vérifier que c'est bien un token d'activation
    if (payload.type !== 'activation') {
      return NextResponse.json({ success: false, error: "Type de token invalide" }, { status: 401 })
    }

    // ✅ Recherche de l'utilisateur
    const db = await getDataSource()
    const userRepo = db.getRepository(User)
    const user = await userRepo.findOne({ where: { id: payload.userId } })

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur introuvable" }, { status: 404 })
    }

    // ✅ Vérifier que le compte n'est pas déjà activé
    if (user.isActive && !user.motDePasseTemporaire) {
      return NextResponse.json({ 
        success: false, 
        error: "Le compte est déjà activé" 
      }, { status: 400 })
    }

    // ✅ Activer le compte
    if (newPassword) {
      // Si un nouveau mot de passe est fourni, on le change
      const hashedPassword = await hashPassword(newPassword)
      user.password = hashedPassword
    }
    
    user.motDePasseTemporaire = false
    user.isActive = true
    
    
    
    await userRepo.save(user)
    console.log("✅ [ACTIVATE] Compte activé avec succès pour:", user.email)

    return NextResponse.json({ 
      success: true, 
      message: "Compte activé avec succès !" 
    }, { status: 200 })

  } catch (err: any) {
    console.error("💥 [ACTIVATE] Erreur:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}