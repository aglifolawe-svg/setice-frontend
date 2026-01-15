/* eslint-disable @typescript-eslint/no-require-imports */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import type { EspacePedagogique } from './EspacePedagogique'

@Entity('matieres')
export class Matiere {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, nullable: true })  // ← AJOUTER nullable: true
  code?: string  // ← AJOUTER ? pour optionnel

  @Column()
  libelle!: string

  @OneToMany(
    () => require('./EspacePedagogique').EspacePedagogique,
    (espace: EspacePedagogique) => espace.matiere
  )
  espacesPedagogiques!: EspacePedagogique[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}