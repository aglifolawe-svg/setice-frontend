console.log('🟢 [ETUDIANT] 1. Début chargement Etudiant.ts')

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm'

console.log('🟢 [ETUDIANT] 2. TypeORM importé avec succès')

import { Promotion } from './Promotion'
import { User } from './User'
import { EspacePedagogique } from './EspacePedagogique'

console.log('🟢 [ETUDIANT] 3. Toutes les dépendances importées (Promotion, User, EspacePedagogique)')

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(
    () => Promotion,
    (promotion) => promotion.etudiants,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    }
  )
  @JoinColumn()
  promotion!: Promotion

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User

  @Column({ unique: true })
  matricule!: string

  @ManyToMany(() => EspacePedagogique, (espace) => espace.etudiants)
  espacesPedagogiques!: EspacePedagogique[]
}

console.log('✅ [ETUDIANT] 4. Classe Etudiant définie avec succès')