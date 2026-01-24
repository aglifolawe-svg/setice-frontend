import { DataSource } from 'typeorm'
import { User } from '@/src/entities/User'
import { Etudiant } from '@/src/entities/Etudiant'
import { Promotion } from '@/src/entities/Promotion'
import { Formateur } from '@/src/entities/Formateur'
import { Matiere } from '@/src/entities/Matiere'
import { EspacePedagogique } from '@/src/entities/EspacePedagogique'
import { Assignation } from '../entities/Assignation'
import { Travail } from '../entities/Travail'
import { Evaluation } from '../entities/Evaluation'
import { Livraison } from '../entities/Livraison'

// ✅ Configuration qui fonctionne en local ET sur Render
const isProduction = process.env.NODE_ENV === 'production'

export const AppDataSource = new DataSource({
  type: 'postgres',
  
  // ✅ Option 1 : Utiliser DATABASE_URL (recommandé pour Render)
  url: process.env.DATABASE_URL,
  
  // ✅ Option 2 : Fallback sur les variables individuelles (pour local)
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'azerty',
  database: process.env.DB_NAME || 'setice_db',
  
  // ✅ SSL requis pour Render PostgreSQL
  ssl: isProduction ? {
    rejectUnauthorized: false
  } : false,
  
  // ⚠️ synchronize: true uniquement en développement
  synchronize: !isProduction,
  
  logging: true,
  
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

// ✅ Initialisation avec logs détaillés
let isInitialized = false

export async function initializeDatabase() {
  if (isInitialized) {
    console.log('⚠️ Database déjà initialisée')
    return AppDataSource
  }

  try {
    console.log('⏳ Initialisation DB...')
    console.log('🌐 Environment:', process.env.NODE_ENV)
    console.log('🔗 Using DATABASE_URL:', !!process.env.DATABASE_URL)
    
    await AppDataSource.initialize()
    
    isInitialized = true
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ TypeORM connecté avec succès!')
    console.log('📊 Database:', AppDataSource.options.database)
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    return AppDataSource
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.error('❌ Erreur connexion TypeORM:')
    console.error('Error:', error)
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    throw error
  }
}

// ✅ Auto-initialisation (optionnel)
if (process.env.NODE_ENV !== 'test') {
  initializeDatabase().catch(console.error)
}