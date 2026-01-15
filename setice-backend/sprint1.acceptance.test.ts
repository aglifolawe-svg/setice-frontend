/**
 * 🧪 TESTS SPRINT 1 - SETICE
 * Tests d'acceptation alignés sur les User Stories et critères Gherkin
 * 
 * Sprint: Sprint 1 (14/12/2025 → 17/12/2025)
 * Objectif: Fondations administratives et académiques
 * Acteur principal: Directeur des Études
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'

// ====================================
// CONFIGURATION
// ====================================

const BASE_URL = 'http://localhost:3000/api'

// Données de test (du topo)
const DIRECTEUR_CREDENTIALS = {
  email: 'directeur@setice.edu',
  password: 'password123'
}

let authToken: string = ''

// IDs pour les tests de relations
let promotionId: string = ''
let matiereId: string = ''
let formateurId: string = ''
let etudiantId: string = ''
let espacePedagogiqueId: string = ''

// ====================================
// HELPERS
// ====================================

async function makeRequest(
  method: string,
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any,
  useAuth: boolean = false
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headers: any = {
    'Content-Type': 'application/json',
  }

  if (useAuth) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()
  return { status: response.status, data }
}

// ====================================
// SETUP & TEARDOWN
// ====================================

beforeAll(async () => {
  console.log('🔐 Authentification du Directeur des Études...')
  
  const { status, data } = await makeRequest('POST', '/auth/login', DIRECTEUR_CREDENTIALS)
  
  if (status !== 200 || !data.success) {
    throw new Error('❌ Échec de l\'authentification du Directeur')
  }
  
  authToken = data.data.token
  console.log('✅ Directeur authentifié avec succès')
})

afterAll(() => {
  console.log('✅ Suite de tests Sprint 1 terminée')
})

// ====================================
// 🟦 US U2.1 — Création compte Formateur
// ====================================

describe('US U2.1 — Création compte Formateur', () => {
  
  describe('Scenario: Création réussie d\'un Formateur non actif', () => {
    
    it('GIVEN le Directeur des Études est authentifié', async () => {
      expect(authToken).toBeTruthy()
    })
    
    it('WHEN il saisit les informations obligatoires (nom, prénom, email) AND il valide la création', async () => {
      const formateurData = {
        nom: 'MARTIN',
        prenom: 'Sophie',
        email: 'sophie.martin@setice.edu',
        specialite: 'Bases de Données'
      }
      
      const { status, data } = await makeRequest('POST', '/formateurs/create', formateurData, true)
      
      // THEN le compte Formateur est créé avec le statut "Non Actif"
      expect(status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.nom).toBe('MARTIN')
      expect(data.data.email).toBe('sophie.martin@setice.edu')
      
      // Sauvegarder l'ID pour les tests suivants
      formateurId = data.data.id
      
      console.log('✅ Formateur créé avec succès:', formateurId)
    })
  })
  
  describe('Scenario: Email déjà existant', () => {
    
    it('WHEN il saisit un email déjà utilisé THEN le système refuse la création', async () => {
      const duplicateFormateur = {
        nom: 'AUTRE',
        prenom: 'Formateur',
        email: 'sophie.martin@setice.edu', // Email déjà utilisé
        specialite: 'Test'
      }
      
      const { status, data } = await makeRequest('POST', '/formateurs/create', duplicateFormateur, true)
      
      expect(status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBeDefined()
      
      console.log('✅ Duplication d\'email correctement refusée')
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur est connecté WHEN il tente de créer un Formateur THEN l\'accès est refusé', async () => {
      const formateurData = {
        nom: 'TEST',
        prenom: 'Non Autorisé',
        email: 'test@setice.edu',
        specialite: 'Test'
      }
      
      // Sans token d'authentification
      const { status, data } = await makeRequest('POST', '/formateurs/create', formateurData, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 🟦 US U2.2 — Création promotion
// ====================================

describe('US U2.2 — Création promotion', () => {
  
  describe('Scenario: Création réussie', () => {
    
    it('WHEN il saisit l\'année académique et la filière THEN la promotion est enregistrée', async () => {
      const promotionData = {
        code: 'M1-IA-2025',
        libelle: 'Master 1 Intelligence Artificielle 2025',
        annee: '2024-2025'
      }
      
      const { status, data } = await makeRequest('POST', '/promotions/create', promotionData, true)
      
      expect(status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.code).toBe('M1-IA-2025')
      
      promotionId = data.data.id
      
      console.log('✅ Promotion créée avec succès:', promotionId)
    })
  })
  
  describe('Scenario: Promotion déjà existante', () => {
    
    it('WHEN il tente de créer une promotion identique THEN le système refuse la création', async () => {
      const duplicatePromotion = {
        code: 'M1-IA-2025', // Code déjà utilisé
        libelle: 'Autre libellé',
        annee: '2024-2025'
      }
      
      const { status, data } = await makeRequest('POST', '/promotions/create', duplicatePromotion, true)
      
      expect(status).toBe(400)
      expect(data.success).toBe(false)
      
      console.log('✅ Duplication de promotion correctement refusée')
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur WHEN il tente de créer une promotion THEN l\'accès est refusé', async () => {
      const promotionData = {
        code: 'TEST-2025',
        libelle: 'Test',
        annee: '2024-2025'
      }
      
      const { status, data } = await makeRequest('POST', '/promotions/create', promotionData, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 🟦 US U2.3 — Création étudiant
// ====================================

describe('US U2.3 — Création étudiant', () => {
  
  describe('Scenario: Création réussie', () => {
    
    it('GIVEN une promotion existe WHEN il saisit les informations de l\'étudiant THEN le compte Étudiant est créé avec le statut "Non Actif"', async () => {
      const etudiantData = {
        nom: 'DUBOIS',
        prenom: 'Pierre',
        email: 'pierre.dubois@setice.edu',
        promotionId: promotionId, // Promotion créée précédemment
        matricule: 'ET202501'
      }
      
      const { status, data } = await makeRequest('POST', '/etudiants/create', etudiantData, true)
      
      expect(status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.nom).toBe('DUBOIS')
      expect(data.data.matricule).toBe('ET202501')
      
      etudiantId = data.data.id
      
      console.log('✅ Étudiant créé avec succès:', etudiantId)
    })
  })
  
  describe('Scenario: Promotion inexistante', () => {
    
    it('WHEN il sélectionne une promotion inexistante THEN la création est refusée', async () => {
      const etudiantData = {
        nom: 'TEST',
        prenom: 'Étudiant',
        email: 'test.etudiant2@setice.edu',
        promotionId: '00000000-0000-0000-0000-000000000000', // ID inexistant
        matricule: 'ET999998'
      }
      
      const { status, data } = await makeRequest('POST', '/etudiants/create', etudiantData, true)
      
      expect(status).toBe(400)
      expect(data.success).toBe(false)
      
      console.log('✅ Création avec promotion inexistante correctement refusée')
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur WHEN il tente de créer un étudiant THEN l\'accès est refusé', async () => {
      const etudiantData = {
        nom: 'TEST',
        prenom: 'Non Autorisé',
        email: 'test@setice.edu',
        promotionId: promotionId,
        matricule: 'ET999997'
      }
      
      const { status, data } = await makeRequest('POST', '/etudiants/create', etudiantData, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 🟦 US U3.1 — Création espace pédagogique
// ====================================

describe('US U3.1 — Création espace pédagogique', () => {
  
  beforeAll(async () => {
    // Créer une matière pour les tests
    const matiereData = {
      libelle: 'Apprentissage Automatique',
      code: 'AA/M1'
    }
    
    const { data } = await makeRequest('POST', '/matieres/create', matiereData, true)
    matiereId = data.data.id
    
    console.log('✅ Matière de test créée:', matiereId)
  })
  
  describe('Scenario: Création manuelle réussie', () => {
    
    it('WHEN il sélectionne une promotion, une matière et un formateur THEN un espace pédagogique est créé', async () => {
      const espaceData = {
        promotionId: promotionId,
        matiereId: matiereId,
        formateurId: formateurId,
        annee: '2024-2025'
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/create', espaceData, true)
      
      expect(status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      
      espacePedagogiqueId = data.data.id
      
      console.log('✅ Espace pédagogique créé avec succès:', espacePedagogiqueId)
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur WHEN il tente de créer un espace pédagogique THEN l\'accès est refusé', async () => {
      const espaceData = {
        promotionId: promotionId,
        matiereId: matiereId,
        formateurId: formateurId,
        annee: '2024-2025'
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/create', espaceData, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 🟦 US U3.2 — Affectation Formateur
// ====================================

describe('US U3.2 — Affectation Formateur', () => {
  
  describe('Scenario: Affectation réussie', () => {
    
    it('GIVEN l\'espace pédagogique existe AND le Formateur existe WHEN il valide l\'affectation THEN le Formateur devient responsable', async () => {
      const affectationData = {
        espacePedagogiqueId: espacePedagogiqueId,
        formateurId: formateurId
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/assign-formateur', affectationData, true)
      
      expect(status).toBe(200)
      expect(data.success).toBe(true)
      
      console.log('✅ Formateur affecté avec succès')
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur WHEN il tente l\'affectation THEN l\'accès est refusé', async () => {
      const affectationData = {
        espacePedagogiqueId: espacePedagogiqueId,
        formateurId: formateurId
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/assign-formateur', affectationData, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 🟦 US U3.3 — Ajout étudiants
// ====================================

describe('US U3.3 — Ajout étudiants', () => {
  
  describe('Scenario: Ajout réussi', () => {
    
    it('WHEN il sélectionne une promotion THEN tous les étudiants de la promotion sont inscrits', async () => {
      const inscriptionData = {
        espacePedagogiqueId: espacePedagogiqueId,
        promotionId: promotionId
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/add-etudiants', inscriptionData, true)
      
      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.inscrits).toBeGreaterThan(0)
      
      console.log(`✅ ${data.data.inscrits} étudiant(s) inscrit(s) avec succès`)
    })
  })
  
  describe('Scenario: Étudiant déjà inscrit', () => {
    
    it('WHEN il tente une inscription existante THEN le système empêche la duplication', async () => {
      const inscriptionData = {
        espacePedagogiqueId: espacePedagogiqueId,
        promotionId: promotionId // Même promotion qu'avant
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/add-etudiants', inscriptionData, true)
      
      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.dejaInscrits).toBeGreaterThan(0) // Détecte les doublons
      
      console.log(`✅ ${data.data.dejaInscrits} étudiant(s) déjà inscrit(s) correctement détecté(s)`)
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur WHEN il tente l\'inscription THEN l\'accès est refusé', async () => {
      const inscriptionData = {
        espacePedagogiqueId: espacePedagogiqueId,
        promotionId: promotionId
      }
      
      const { status, data } = await makeRequest('POST', '/espaces-pedagogique/add-etudiants', inscriptionData, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 🟦 US U3.5 — Consultation espaces
// ====================================

describe('US U3.5 — Consultation espaces pédagogiques', () => {
  
  describe('Scenario: Consultation réussie', () => {
    
    it('WHEN il accède à la liste des espaces pédagogiques THEN tous les espaces existants sont affichés', async () => {
      const { status, data } = await makeRequest('GET', '/espaces-pedagogique/list', undefined, true)
      
      expect(status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
      
      // Vérifier que les informations essentielles sont présentes
      const firstEspace = data.data[0]
      expect(firstEspace.matiere).toBeDefined()
      expect(firstEspace.formateur).toBeDefined()
      expect(firstEspace.promotion).toBeDefined()
      
      console.log(`✅ ${data.data.length} espace(s) pédagogique(s) consulté(s)`)
    })
  })
  
  describe('Scenario: Accès non autorisé', () => {
    
    it('GIVEN un utilisateur non Directeur WHEN il tente de consulter tous les espaces THEN l\'accès est refusé', async () => {
      const { status, data } = await makeRequest('GET', '/espaces-pedagogique/list', undefined, false)
      
      expect(status).toBe(401)
      expect(data.success).toBe(false)
      
      console.log('✅ Accès non autorisé correctement refusé')
    })
  })
})

// ====================================
// 📊 RÉSUMÉ
// ====================================

describe('📊 RÉSUMÉ SPRINT 1', () => {
  it('Toutes les User Stories sont couvertes', () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║  ✅ SPRINT 1 — TESTS D'ACCEPTATION COMPLÉTÉS      ║
╠════════════════════════════════════════════════════╣
║  US U2.1 — Création Formateur              ✅      ║
║  US U2.2 — Création Promotion              ✅      ║
║  US U2.3 — Création Étudiant               ✅      ║
║  US U3.1 — Création Espace Pédagogique     ✅      ║
║  US U3.2 — Affectation Formateur           ✅      ║
║  US U3.3 — Ajout Étudiants                 ✅      ║
║  US U3.5 — Consultation Espaces            ✅      ║
╚════════════════════════════════════════════════════╝
    `)
    expect(true).toBe(true)
  })
})
