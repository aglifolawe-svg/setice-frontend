import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm'
import type { Promotion } from './Promotion'
import { User } from './User'
import { EspacePedagogique } from './EspacePedagogique'

@Entity('etudiants')
export class Etudiant {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  // L'étudiant appartient à UNE promotion
  @ManyToOne(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    () => require('./Promotion').Promotion,
    (promotion: Promotion) => promotion.etudiants,
    {
      nullable: false,
      onDelete: 'RESTRICT',
    }
  )
  @JoinColumn()
  promotion!: Promotion

  // L'étudiant est un user
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User

  @Column({ unique: true })
  matricule!: string

  @Column({ nullable: true })
  activationToken?: string

  @Column({ type: 'timestamp', nullable: true })
  activationTokenExpires?: Date
  // ✅ RELATION INVERSE MANQUANTE
  @ManyToMany(
    () => EspacePedagogique,
    (espace) => espace.etudiants
  )
  espacesPedagogiques!: EspacePedagogique[]
}
