// src/repositories/travail.repository.ts
import { getDataSource } from '@/src/lib/db'
import { Travail } from '@/src/entities/Travail'

export const travailRepository = {
  async createTravail(travail: Partial<Travail>) {
    const db = await getDataSource()
    const repo = db.getRepository(Travail)
    const entity = repo.create(travail)
    await repo.save(entity)
    return entity
  },

  async findById(id: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Travail)
    return repo.findOne({
       where: { id },
       relations: ['espacePedagogique',
        'espacePedagogique.etudiants',
        'espacePedagogique.promotion',
        'espacePedagogique.matiere',
        
        'formateur'],
      })
  },

  async listByEspace(espaceId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(Travail)
    return repo.find({
      where: { espacePedagogique: { id: espaceId } },
      relations: ['espacePedagogique', 'espacePedagogique.matiere', 'espacePedagogique.promotion'],
      order: { dateLimite: 'ASC' },
    })
  },


  async findByIdEntity(id: string): Promise<Travail | null> {
    const db = await getDataSource()
    return await db.getRepository(Travail).findOne({
      where: { id },
      relations: ['formateur', 'formateur.user', 'espacePedagogique'], // Ajustez selon vos relations
    })
  },
}
