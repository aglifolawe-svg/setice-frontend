
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm'
// ✅ CORRECTION : Utilisez "import type" pour TOUTES les entités
import type { Promotion } from './Promotion'
import type { User } from './User'
import type { EspacePedagogique } from './EspacePedagogique'

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // ✅ Les fonctions fléchées chargent les classes à l'exécution
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