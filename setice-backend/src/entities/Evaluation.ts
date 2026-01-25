// Evaluation.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import type { Assignation } from './Assignation'
import type { User } from './User'

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @OneToOne(() => Assignation, { eager: true })
  @JoinColumn()
  assignation!: Assignation

  @ManyToOne(() => User, { eager: true })
  formateur!: User

  @Column('float')
  note!: number

  @Column({ type: 'text', nullable: true })
  commentaire?: string

  @CreateDateColumn()
  dateEvaluation!: Date
}