import { Etudiant } from '@/src/entities/Etudiant'
import { getDataSource } from '@/src/lib/db'

export const etudiantRepository = {
  // ✅ Retourne l'ENTITÉ complète (pour usage interne)
  async findByIdEntity(id: string): Promise<Etudiant | null> {
    const db = await getDataSource()
    return await db.getRepository(Etudiant).findOne({
      where: { id },
      relations: ['user', 'promotion'],
    })
  },

  // ✅ Retourne un objet PLAIN (pour API)
  async findById(id: string) {
    const etudiant = await this.findByIdEntity(id)
    
    if (!etudiant) return null

    return {
      id: etudiant.id,
      matricule: etudiant.matricule,
      userId: etudiant.user.id,
      nom: etudiant.user.nom,
      prenom: etudiant.user.prenom,
      email: etudiant.user.email,
      role: etudiant.user.role,
      promotionId: etudiant.promotion.id,
      promotionCode: etudiant.promotion.code,
      promotionLibelle: etudiant.promotion.libelle,
    }
  },

  async findByUserId(userId: string) {
    const db = await getDataSource()
    const etudiant = await db.getRepository(Etudiant).findOne({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'promotion'],
    })

    if (!etudiant) return null

    return {
      id: etudiant.id,
      matricule: etudiant.matricule,
      userId: etudiant.user.id,
      nom: etudiant.user.nom,
      prenom: etudiant.user.prenom,
      email: etudiant.user.email,
      role: etudiant.user.role,
      promotionId: etudiant.promotion.id,
      promotionCode: etudiant.promotion.code,
      promotionLibelle: etudiant.promotion.libelle,
    }
  },
}