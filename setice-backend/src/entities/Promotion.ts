import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
// ✅ CORRECTION : Utilisez "import type" au lieu d'import normal
import type { Etudiant } from './Etudiant'

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

  // ✅ La fonction fléchée charge la classe à l'exécution
  @OneToMany(() => Etudiant, (etudiant) => etudiant.promotion)
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}