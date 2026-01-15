import { getDataSource } from '@/src/lib/db'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Etudiant } from '@/src/entities/Etudiant'

export const espacePedagogiqueRepository = {
  async create(data: {
    promotionId: string
    matiereId: string
    formateurId: string
  }) {
    const db = await getDataSource()
    return db.getRepository(EspacePedagogique).save({
      promotion: { id: data.promotionId },
      matiere: { id: data.matiereId },
      formateur: { id: data.formateurId },
    })
  },

  async findAll() {
    const db = await getDataSource()
    return db.getRepository(EspacePedagogique).find({
      relations: {
        promotion: true,
        matiere: true,
        formateur: { user: true },
        etudiants: { user: true },
      },
      order: { createdAt: 'DESC' },
    })
  },

  async findById(id: string) {
    const db = await getDataSource()
    return db.getRepository(EspacePedagogique).findOne({
      where: { id },
      relations: {
        promotion: true,
        matiere: true,
        formateur: { user: true },
        etudiants: { user: true },
      },
    })
  },

  async assignFormateur(espaceId: string, formateurId: string) {
    const db = await getDataSource()
    const repo = db.getRepository(EspacePedagogique)

    const espace = await repo.findOne({ where: { id: espaceId } })
    if (!espace) throw new Error('ESPACE_NOT_FOUND')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    espace.formateur = { id: formateurId } as any
    return repo.save(espace)
  },

  async addEtudiants(espaceId: string, etudiantIds: string[]) {
    const db = await getDataSource()
    const espaceRepo = db.getRepository(EspacePedagogique)
    const etudiantRepo = db.getRepository(Etudiant)

    const espace = await espaceRepo.findOne({
      where: { id: espaceId },
      relations: ['etudiants'],
    })
    if (!espace) throw new Error('ESPACE_NOT_FOUND')

    const existingIds = espace.etudiants.map(e => e.id)
    const newIds = etudiantIds.filter(id => !existingIds.includes(id))

    if (newIds.length === 0) {
      return { inscrits: 0, dejaInscrits: etudiantIds.length }
    }

    const nouveaux = await etudiantRepo.findByIds(newIds)
    espace.etudiants.push(...nouveaux)

    await espaceRepo.save(espace)

    return {
      inscrits: newIds.length,
      dejaInscrits: etudiantIds.length - newIds.length,
    }
  },

}
