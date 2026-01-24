import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'
import { CreateEtudiantInput } from '@/src/schemas/etudiant.schema'
import { generateMatricule } from '../lib/etudiant.utils'
import jwt from 'jsonwebtoken'
import { sendActivationEmail } from '@/src/lib/mail'

export async function createEtudiant(input: CreateEtudiantInput) {
  const db = await getDataSource()

  const userRepo = db.getRepository(User)
  const etudiantRepo = db.getRepository(Etudiant)
  const promotionRepo = db.getRepository(Promotion)

  // 1️⃣ Vérifier promotion
  const promotion = await promotionRepo.findOne({
    where: { id: input.promotionId },
  })

  if (!promotion) {
    throw new Error('PROMOTION_NOT_FOUND')
  }

  // 2️⃣ Vérifier email
  const exists = await userRepo.findOne({
    where: { email: input.email },
  })

  if (exists) {
    throw new Error('USER_ALREADY_EXISTS')
  }

  // 3️⃣ Mot de passe temporaire
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)

  // 4️⃣ Créer User
  const user = userRepo.create({
    nom: input.nom,
    prenom: input.prenom,
    email: input.email,
    password: hashedPassword,
    role: Role.ETUDIANT,
    motDePasseTemporaire: true,
    isActive: false
  })

  await userRepo.save(user)

  // 5️⃣ Générer le token d'activation JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'super-secret-key',
    { expiresIn: '24h' }
  )

  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

  // 6️⃣ Générer un matricule unique
  let studentNumber = await etudiantRepo.count({ where: { promotion } }) + 1
  let matricule: string
  let existing: Etudiant | null = null

  do {
    matricule = generateMatricule(promotion.code, studentNumber)
    existing = await etudiantRepo.findOne({ where: { matricule } })
    studentNumber++
  } while (existing)

  // 7️⃣ Créer l'étudiant
  const etudiant = etudiantRepo.create({
    user,
    promotion,
    matricule,
  })
  
  await etudiantRepo.save(etudiant)

  // 8️⃣ Envoyer l'email d'activation
  try {
    await sendActivationEmail(user.email, matricule, tempPassword, token)
  } catch (emailError) {
    console.error('❌ Erreur envoi email:', emailError)
  }

  // ✅ Retourner un objet FLAT (pas d'objets imbriqués)
  return {
    id: etudiant.id,
    matricule: matricule,
    // User fields
    userId: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    role: user.role,
    motDePasseTemporaire: true,
    temporaryPassword: tempPassword,
    activationToken: token,
    // Promotion fields
    promotionId: promotion.id,
    promotionCode: promotion.code,
    promotionLibelle: promotion.libelle,
    promotionAnnee: promotion.annee,
  }
}

export async function getEtudiants() {
  const db = await getDataSource()
  const etudiantRepo = db.getRepository(Etudiant)

  const etudiants = await etudiantRepo.find({
    relations: ['user', 'promotion'],
  })

  // ✅ Retourner un tableau d'objets FLAT
  return etudiants.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    // User fields
    userId: e.user.id,
    nom: e.user.nom,
    prenom: e.user.prenom,
    email: e.user.email,
    role: e.user.role,
    motDePasseTemporaire: e.user.motDePasseTemporaire,
    actif: !e.user.motDePasseTemporaire && e.user.isActive,
    // Promotion fields
    promotionId: e.promotion.id,
    promotionCode: e.promotion.code,
    promotionLibelle: e.promotion.libelle,
    promotionAnnee: e.promotion.annee,
    // Dates
    createdAt: e.user.createdAt.toISOString(),
    updatedAt: e.user.updatedAt.toISOString(),
  }))
}