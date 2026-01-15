import { getDataSource } from '@/src/lib/db'
import { Matiere } from '@/src/entities/Matiere'
import { CreateMatiereDto } from '@/src/schemas/matiere.schema'

export async function createMatiere(input: CreateMatiereDto) {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  // 1️⃣ Vérifier unicité du code (si fourni)
  if (input.code) {
    const exists = await matiereRepo.findOne({
      where: { code: input.code },
    })

    if (exists) {
      throw new Error('MATIERE_ALREADY_EXISTS')
    }
  }

  // 2️⃣ Créer matière
  const matiere = matiereRepo.create({
    code: input.code,
    libelle: input.libelle,
  } as Partial<Matiere>)

  await matiereRepo.save(matiere)

  return {
    id: matiere.id,
    code: matiere.code,
    libelle: matiere.libelle,
  }
}
export async function listMatieres() {
  const db = await getDataSource()
  const matiereRepo = db.getRepository(Matiere)

  const matieres = await matiereRepo.find()

  // On retourne un format simple pour le frontend
  return matieres.map((m) => ({
    id: m.id,
    code: m.code,
    libelle: m.libelle,
  }))
}