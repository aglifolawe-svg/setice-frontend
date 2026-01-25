console.log('🔵 [REPO-PROMOTION] 1. Début chargement promotion.repository.ts')

import { Promotion } from '@/src/entities/Promotion'

console.log('🔵 [REPO-PROMOTION] 2. Promotion importée avec succès')

import { getDataSource } from '@/src/lib/db'

console.log('🔵 [REPO-PROMOTION] 3. getDataSource importé avec succès')

export const promotionRepository = {
  async findByCode(code: string) {
    console.log('🔵 [REPO-PROMOTION] findByCode appelé pour:', code)
    const db = await getDataSource()
    return db.getRepository(Promotion).findOne({
      where: { code },
    })
  },

  async create(data: {
    code: string
    libelle: string
    annee: string
  }) {
    console.log('🔵 [REPO-PROMOTION] create appelé avec:', data)
    const db = await getDataSource()
    return db.getRepository(Promotion).save(data)
  },

  async findAll() {
    console.log('🔵 [REPO-PROMOTION] findAll appelé')
    const db = await getDataSource()
    return db.getRepository(Promotion).find({
      order: { createdAt: 'DESC' },
    })
  },
}

console.log('✅ [REPO-PROMOTION] 4. Repository défini avec succès')