import { DataSource } from 'typeorm'
import { User } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { Matiere } from '@/src/entities/Matiere'
import { Formateur } from '@/src/entities/Formateur'
import { Evaluation } from '@/src/entities/Evaluation'
import { Assignation } from '@/src/entities/Assignation'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Livraison } from '@/src/entities/Livraison'
import { Travail } from '@/src/entities/Travail'

// ... autres imports

const isProduction = process.env.NODE_ENV === 'production'

// ✅ Fonction pour construire l'URL de connexion
function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
    }
  }
  
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'azerty',
    database: process.env.DB_NAME || 'setice_db',
  }
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  
  ...getDatabaseConfig(),
  
  ssl: isProduction ? { 
    rejectUnauthorized: false 
  } : false,
  
  // ✅ Paramètres de connexion importants
  connectTimeoutMS: 10000,
  maxQueryExecutionTime: 5000,
  
  synchronize: !isProduction,
  logging: ['error', 'warn'],
  
  entities: [
    User, 
    Etudiant, 
    Promotion, 
    Formateur, 
    Matiere, 
    EspacePedagogique, 
    Assignation, 
    Travail, 
    Evaluation, 
    Livraison
  ],
})