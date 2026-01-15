import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { User } from './User'

@Entity('formateurs')
export class Formateur {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', nullable: true })
  specialite: string | null = null

  // Un formateur = un user
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User
}
