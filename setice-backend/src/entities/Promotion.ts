import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Etudiant } from './Etudiant'

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  code!: string

  @Column()
  libelle!: string

  @Column()
  annee!: string

  @OneToMany(
    () => Etudiant,
    (etudiant) => etudiant.promotion
  )
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
