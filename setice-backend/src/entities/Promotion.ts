console.log('🟡 [PROMOTION] 1. Début chargement Promotion.ts')

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

console.log('🟡 [PROMOTION] 2. TypeORM importé avec succès')

import { Etudiant } from './Etudiant'  // ✅ Import normal

console.log('🟡 [PROMOTION] 3. Etudiant importé avec succès')

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

  @OneToMany(() => Etudiant, (etudiant) => etudiant.promotion)  // ✅ Fonction fléchée
  etudiants!: Etudiant[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}

console.log('✅ [PROMOTION] 4. Classe Promotion définie avec succès')