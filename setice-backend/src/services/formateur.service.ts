import { getDataSource } from '@/src/lib/db'
import { User, Role } from '@/src/entities/User'
import { Formateur } from '@/src/entities/Formateur'
import { generateTemporaryPassword, hashPassword } from '@/src/lib/password'

export interface CreateFormateurInput {
  nom: string
  prenom: string
  email: string
  specialite?: string
}

export async function createFormateur(input: CreateFormateurInput) {
  const db = await getDataSource()

  const userRepo = db.getRepository(User)
  const formateurRepo = db.getRepository(Formateur)

  // 1️⃣ Vérifier si l’email existe déjà
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
  } as Partial<User>)

  await userRepo.save(user)

  // 4️⃣ Créer le Formateur lié au User
  const formateur = formateurRepo.create({
    user,
    specialite: input.specialite || null,
  } as Partial<Formateur>)

  await formateurRepo.save(formateur)

  // 5️⃣ Retour utile (sans password)
  return {
    id: formateur.id,
    user: {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      motDePasseTemporaire: true,
      temporaryPassword: tempPassword, // à afficher UNE SEULE FOIS
    },
    specialite: formateur.specialite
  }
}
// ✅ Récupérer tous les formateurs
export async function getFormateurs() {
  const db = await getDataSource()
  const formateurRepo = db.getRepository(Formateur)

  // On récupère le formateur avec la relation User
  const formateurs = await formateurRepo.find({
    relations: ['user'], // important pour avoir nom, prénom, email
  })

  // Formater pour le frontend
  return formateurs.map((f) => ({
    id: f.id,
    actif: f.user.motDePasseTemporaire ? false : true, // exemple de statut, à adapter
    user: {
      id: f.user.id,
      nom: f.user.nom,
      prenom: f.user.prenom,
      email: f.user.email,
      role: f.user.role,
    },
    createdAt: f.user.createdAt,
    specialite: f.specialite || null, // si tu ajoutes spécialité plus tard
  }))
}
