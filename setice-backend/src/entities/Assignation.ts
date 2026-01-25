// Assignation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm'
import type { Travail } from './Travail'
import type { Etudiant } from './Etudiant'
import type { User } from './User'

export enum StatutAssignation {
  ASSIGNE = 'ASSIGNE',
  LIVRE = 'LIVRE',
  EVALUE = 'EVALUE',
}

@Entity('assignations')
@Unique(['travail', 'etudiant'])
export class Assignation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => Travail, { eager: true })
  travail!: Travail

  @ManyToOne(() => Etudiant, { eager: true })
  etudiant!: Etudiant

  @ManyToOne(() => User, { eager: true })
  formateur!: User

  @Column({
    type: 'enum',
    enum: StatutAssignation,
    default: StatutAssignation.ASSIGNE,
  })
  statut!: StatutAssignation

  @Column({ type: 'timestamp', nullable: true })
  dateLivraison?: Date

  @CreateDateColumn()
  createdAt!: Date
}