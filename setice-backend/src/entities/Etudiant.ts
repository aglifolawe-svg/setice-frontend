import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Column,
} from 'typeorm'

import { Promotion } from './Promotion'
import { User } from './User'
import { EspacePedagogique } from './EspacePedagogique'

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
