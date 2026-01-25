/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/formateur.service.ts
import { getDataSource } from '@/src/lib/db'  // ✅ Changé
import { Role } from '@/src/entities/User'  // ✅ Gardez Role comme import normal (c'est un enum)
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail-form'

export interface CreateFormateurInput {
  nom: string
  prenom: string
  email: string
  specialite?: string
}

export async function createFormateur(input: CreateFormateurInput) {
  const db = await getDataSource()

  // ✅ Import dynamique des entités
  const { User } = await import('@/src/entities/User')
  const { Formateur } = await import('@/src/entities/Formateur')

  const userRepo = db.getRepository(User)
  const formateurRepo = db.getRepository(Formateur)

  // 1️⃣ Vérifier si l'email existe déjà
  const existingUser = await userRepo.findOne({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  // 2️⃣ Générer mot de passe temporaire
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  // 3️⃣ Créer le User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.FORMATEUR,
    motDePasseTemporaire: true,
    isActive: false,
  })

  await userRepo.save(user)

  // 4️⃣ Générer le token d'activation JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'super-secret-key',
    { expiresIn: '24h' }
  )

  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

  // 5️⃣ Créer le Formateur lié au User
  const formateur = formateurRepo.create({
    user,
    specialite: input.specialite || null,
  })

  await formateurRepo.save(formateur)

  // 6️⃣ Envoyer l'email d'activation
  try {
    await sendActivationEmail(user.email, tempPassword, token)
  } catch (emailError) {
    console.error('❌ Erreur envoi email:', emailError)
  }

  // 7️⃣ Retourner un objet PLAIN
  return {
    id: formateur.id,
    userId: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    specialite: formateur.specialite,
    motDePasseTemporaire: true,
    temporaryPassword: tempPassword,
    activationToken: token,
  }
}

export async function getFormateurs() {
  const db = await getDataSource()
  
  // ✅ Import dynamique
  const { Formateur } = await import('@/src/entities/Formateur')
  
  const formateurRepo = db.getRepository(Formateur)

  const formateurs = await formateurRepo.find({
    relations: ['user'],
  })

  return formateurs.map((f: { id: any; user: { id: any; nom: any; prenom: any; email: any; role: any; motDePasseTemporaire: any; isActive: any; createdAt: { toISOString: () => any } }; specialite: any }) => ({
    id: f.id,
    userId: f.user.id,
    nom: f.user.nom,
    prenom: f.user.prenom,
    email: f.user.email,
    role: f.user.role,
    specialite: f.specialite,
    actif: !f.user.motDePasseTemporaire && f.user.isActive,
    motDePasseTemporaire: f.user.motDePasseTemporaire,
    createdAt: f.user.createdAt.toISOString(),
  }))
}