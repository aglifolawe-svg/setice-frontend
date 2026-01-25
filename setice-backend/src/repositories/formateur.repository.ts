// src/repositories/formateur.repository.ts
import { getDataSource } from '@/src/lib/db'  // ✅ Changé
import type { User } from '@/src/entities/User'  // ✅ import type

export const formateurRepository = {
  async create(user: User) {
    const db = await getDataSource()  // ✅ Await getDataSource
    const { Formateur } = await import('@/src/entities/Formateur')  // ✅ Import dynamique
    const repo = db.getRepository(Formateur)

    const formateur = repo.create({
      user,
    })

    return repo.save(formateur)
  },
}