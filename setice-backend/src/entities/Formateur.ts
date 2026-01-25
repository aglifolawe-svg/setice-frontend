// Formateur.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import type { User } from './User'

@Entity('formateurs')
export class Formateur {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', nullable: true })
  specialite: string | null = null

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User
}