import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'
const JWT_EXPIRES_IN = '24h'

export interface LoginResult {
  user: {
    id: string
    email: string
    nom: string
    prenom: string
    role: string
  }
  token: string
}

export async function login(email: string, password: string): Promise<LoginResult> {
  // Rechercher l'utilisateur par email
  const user = await userRepository.findByEmail(email)

  if (!user) {
    console.log('❌ Utilisateur introuvable')
    throw new Error('INVALID_CREDENTIALS')
  }

  // 🔍 DEBUG — AJOUTE ÇA ICI
  console.log('👉 Email saisi :', email)
  console.log('👉 Mot de passe saisi (plain) :', password)
  console.log('👉 Mot de passe en base (hash) :', user.password)

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password.trim())

  // 🔍 DEBUG — AJOUTE ÇA ICI
  console.log('👉 Résultat bcrypt.compare :', isPasswordValid)

  if (!isPasswordValid) {
    throw new Error('INVALID_CREDENTIALS')
  }

  // Générer le token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )

  return {
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role
    },
    token
  }
}
