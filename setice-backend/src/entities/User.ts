import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum Role {
  DIRECTEUR_ETUDES = 'DIRECTEUR_ETUDES',
  FORMATEUR = 'FORMATEUR',
  ETUDIANT = 'ETUDIANT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Column()
  nom!: string

  @Column()
  prenom!: string

  @Column({
    type: 'enum',
    enum: Role,
  })
  role!: Role

  // Mot de passe généré par le directeur
  @Column({ default: true })
  motDePasseTemporaire!: boolean

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
  activationTokenExpires: Date | undefined
  activationToken: string | undefined
}
