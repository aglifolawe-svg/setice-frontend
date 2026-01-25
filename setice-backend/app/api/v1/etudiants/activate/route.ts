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

export async function POST(req: NextRequest) {
  console.log("")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("🎯 [ACTIVATE] POST /api/v1/etudiants/activate")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  try {
    const body = await req.json()
    console.log("📥 [ACTIVATE] Body reçu:", { hasToken: !!body.token, hasPassword: !!body.newPassword })
    
    const { token, newPassword } = body as { token: string; newPassword: string }

    if (!token || !newPassword) {
      console.log("❌ [ACTIVATE] Données manquantes")
      return NextResponse.json(
        { success: false, error: "Missing token or new password" },
        { status: 400 }
      )
    }

    console.log("🔐 [ACTIVATE] Vérification du token JWT...")
    let payload: ActivatePayload
    try {
      payload = jwt.verify(token, JWT_SECRET) as ActivatePayload
      console.log("✅ [ACTIVATE] Token valide - userId:", payload.userId)
    } catch (err) {
      console.error("❌ [ACTIVATE] Token invalide:", err)
      return NextResponse.json(
        { success: false, error: "Token invalide ou expiré" },
        { status: 401 }
      )
    }

    console.log("🔍 [ACTIVATE] Recherche utilisateur...")
    const db = await getDataSource()
    const userRepo = db.getRepository(User)

    const user = await userRepo.findOne({ where: { id: payload.userId } })
    
    if (!user) {
      console.error("❌ [ACTIVATE] Utilisateur introuvable:", payload.userId)
      return NextResponse.json(
        { success: false, error: "Utilisateur introuvable" },
        { status: 404 }
      )
    }

    console.log("✅ [ACTIVATE] Utilisateur trouvé:", user.email)

    if (!user.motDePasseTemporaire) {
      console.log("⚠️ [ACTIVATE] Compte déjà activé")
      return NextResponse.json(
        { success: false, error: "Le compte est déjà activé" },
        { status: 400 }
      )
    }

    console.log("🔒 [ACTIVATE] Hashage du nouveau mot de passe...")
    const hashedPassword = await hashPassword(newPassword)
    
    console.log("💾 [ACTIVATE] Mise à jour du compte...")
    user.password = hashedPassword
    user.motDePasseTemporaire = false
   
    await userRepo.save(user)

    console.log("✅ [ACTIVATE] Compte activé avec succès!")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("")

    return NextResponse.json(
      { success: true, message: "Compte activé avec succès, mot de passe mis à jour !" },
      { status: 200 }
    )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("")
    console.error("💥 [ACTIVATE] Erreur:", err)
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.error("")
    
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}