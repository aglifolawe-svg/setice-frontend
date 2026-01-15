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
  } as Partial<User>)

  await userRepo.save(user)


  // 5️⃣ Générer le token d'activation JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )

  user.activationToken = token
  user.activationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  await userRepo.save(user)

   // Générer le matricule automatique
  const etudiantsCount = await etudiantRepo.count({ where: { promotion } })
  const matricule = generateMatricule(promotion.code, etudiantsCount+1)

  const etudiant = etudiantRepo.create({
    user,
    promotion,
    matricule,
  })
  await etudiantRepo.save(etudiant)
  await sendActivationEmail(user.email, matricule, tempPassword, token)

  return {
    id: etudiant.id,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      motDePasseTemporaire: true,
      temporaryPassword: tempPassword,
    },
    promotion: {
      id: promotion.id,
      code: promotion.code,
      libelle: promotion.libelle,
      annee: promotion.annee,
    },
    matricule,
  }

}
export async function getEtudiants() {
  const db = await getDataSource()
  const etudiantRepo = db.getRepository(Etudiant)

  const etudiants = await etudiantRepo.find({
    relations: ['user', 'promotion'], // On récupère le user et la promotion
  })

  // Optionnel : formater les données comme le frontend l'attend
  return etudiants.map((e) => ({
    id: e.id,
    matricule: e.matricule,
    
    user: {
      id: e.user.id,
      nom: e.user.nom,
      prenom: e.user.prenom,
      email: e.user.email,

    },
    promotion: {
      id: e.promotion.id,
      code: e.promotion.code,
      libelle: e.promotion.libelle,
      annee: e.promotion.annee,
    },
  }))
}
