import { DataSource } from 'typeorm'
import { User } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { Formateur } from '@/src/entities/Formateur'
import { Matiere } from '@/src/entities/Matiere'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',      // ou process.env.DB_HOST
  port: 5432,             // ou Number(process.env.DB_PORT)
  username: 'postgres',   // ou process.env.DB_USER
  password: 'azerty',           // <-- ici tu dois mettre ton mot de passe ou la variable d'env
  database: 'setice_db',      // ou process.env.DB_NAME
  synchronize: true,
  logging: true,
  entities: [User, Etudiant, Promotion, Formateur, Matiere, EspacePedagogique],
})
