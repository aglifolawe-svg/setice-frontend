import { userRepository } from '../repositories/user.repository'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

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
  try {
    console.log('🔐 [AUTH] Tentative de connexion pour:', email)
    
    // Rechercher l'utilisateur par email
    const user = await userRepository.findByEmail(email)

    if (!user) {
      console.log('❌ [AUTH] Utilisateur introuvable:', email)
      throw new Error('INVALID_CREDENTIALS')
    }

    console.log('✅ [AUTH] Utilisateur trouvé:', {
      id: user.id,
      email: user.email,
      role: user.role
    })

    // Vérifier le mot de passe
    console.log('🔍 [AUTH] Vérification du mot de passe...')
    const isPasswordValid = await bcrypt.compare(password, user.password)

    console.log('🔍 [AUTH] Résultat de la vérification:', isPasswordValid)

    if (!isPasswordValid) {
      console.log('❌ [AUTH] Mot de passe incorrect pour:', email)
      throw new Error('INVALID_CREDENTIALS')
    }

    console.log('✅ [AUTH] Mot de passe validé')

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

    console.log('✅ [AUTH] Token JWT généré')

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
  } catch (error) {
    console.error('❌ [AUTH] Erreur dans login():', error)
    throw error
  }
}