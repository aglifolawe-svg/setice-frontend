 
 

import { getDataSource } from '@/src/lib/db'

export const promotionRepository = {
  async findByCode(code: string) {
    const { Promotion } = await import('@/src/entities/Promotion')
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
    const { Promotion } = await import('@/src/entities/Promotion')
    const db = await getDataSource()
    return db.getRepository(Promotion).save(data)
  },

  async findAll() {
    const { Promotion } = await import('@/src/entities/Promotion')
    const db = await getDataSource()
    return db.getRepository(Promotion).find({
      order: { createdAt: 'DESC' },
    })
  },
}
