// Matiere.ts
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

  @Column({ unique: true, nullable: true })
  code?: string

  @Column()
  libelle!: string

  @OneToMany(() => EspacePedagogique, (espace) => espace.matiere)
  espacesPedagogiques!: EspacePedagogique[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}