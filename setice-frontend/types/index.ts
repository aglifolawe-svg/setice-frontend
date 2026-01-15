// Types TypeScript pour SETICE

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: "DIRECTEUR_ETUDES" | "FORMATEUR" | "ETUDIANT"
}

export interface AuthResponse {
  success: boolean
  data?: {
    token: string
    user: User
  }
  error?: string
}

export type Formateur = {
  id: string
  actif: boolean
  user: {
    id: string
    nom: string
    prenom: string
    email: string
    role: string
  }
  specialite: string | null
}



export interface Promotion {
  id: string
  code: string
  libelle: string
  annee: string
  createdAt: string
}

export interface Etudiant {
  id: string
  matricule: string
  actif: boolean
  promotion?: Promotion
  user: {
    id: string
    nom: string
    prenom: string
    email: string
  }
  createdAt: string
}

export interface Matiere {
  id: string
  code: string
  libelle: string
  credits: number
  createdAt: string
}

export interface EspacePedagogique {
  id: string
  annee: string
  promotion: Promotion
  matiere: Matiere
  formateur: Formateur
  etudiants: Etudiant[]
  createdAt: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface CreateFormateurData {
  nom: string
  prenom: string
  email: string
  specialite?: string
}

export interface CreatePromotionData {
  code: string
  libelle: string
  annee: string
}

export interface CreateEtudiantData {
  nom: string
  prenom: string
  email: string
  promotionId: string
}

export interface CreateMatiereData {
  code: string
  libelle: string
  credits: number
}

export interface CreateEspaceData {
  promotionId: string
  matiereId: string
  formateurId: string
  annee: string
}

export interface AssignFormateurData {
  espacePedagogiqueId: string
  formateurId: string
}

export interface AddEtudiantsData {
  espacePedagogiqueId: string
  promotionId: string
  matiereId: string
}

export interface AddEtudiantsResponse {
  inscrits: number
  dejaInscrits: number
}
