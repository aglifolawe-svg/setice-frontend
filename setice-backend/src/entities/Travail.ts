// Travail.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import type { EspacePedagogique } from './EspacePedagogique'
import type { User } from './User'

export enum TypeTravail {
  INDIVIDUEL = 'INDIVIDUEL',
  COLLECTIF = 'COLLECTIF',
}

export enum StatutTravail {
  BROUILLON = 'BROUILLON',
  PUBLIE = 'PUBLIE',
  CLOTURE = 'CLOTURE',
}

@Entity('travaux')
export class Travail {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  titre!: string

  @Column({ type: 'text' })
  consignes!: string

  @Column({
    type: 'enum',
    enum: TypeTravail,
  })
  type!: TypeTravail

  @Column({ type: 'timestamp' })
  dateLimite!: Date

  @Column({ type: 'int' })
  bareme!: number

  @ManyToOne(() => EspacePedagogique, { eager: true })
  espacePedagogique!: EspacePedagogique

  @ManyToOne(() => User, { eager: true })
  formateur!: User

  @Column({
    type: 'enum',
    enum: StatutTravail,
    default: StatutTravail.BROUILLON,
  })
  statut!: StatutTravail

  @CreateDateColumn()
  createdAt!: Date
}