// Types TypeScript pour SETICE

import { ReactNode } from "react"

export interface User {
  id: string
  email: string
  nom: string
  prenom: string
  role: "DIRECTEUR_ETUDES" | "FORMATEUR" | "ETUDIANT"
}

export enum Role {
  DIRECTEUR_ETUDES = "DIRECTEUR_ETUDES",
  FORMATEUR = "FORMATEUR",
  ETUDIANT = "ETUDIANT",
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
  nbEtudiants: number
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
  nom: string
  id: string
  code: string
  libelle: string
  credits: number
  createdAt: string
}

export interface EspacePedagogique {
  nom: ReactNode
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
  temporaryPassword?: string
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

export type TypeTravail = "INDIVIDUEL" | "COLLECTIF"
export type StatutTravail = "BROUILLON" | "PUBLIE" | "CLOTURE"
export enum StatutAssignation {
  ASSIGNE = 'ASSIGNE',
  LIVRE = 'LIVRE',
  EVALUE = 'EVALUE',
}
export interface Travail {
  etudiants: Etudiant[]
  id: string
  titre: string
  consignes: string
  type: TypeTravail
  dateLimite: string
  bareme: number
  statut: StatutTravail
  espacePedagogique: EspacePedagogique
  formateur: User
  createdAt: string
}

export interface Assignation {
  id: string
  travail: Travail
  etudiant: Etudiant
  formateur: User
  statut: StatutAssignation
  dateAssignation: string
  dateLivraison?: string
  evaluation?: Evaluation | null
}

export interface Evaluation {
  id: string
  assignation?: Assignation
  assignationId?: string
  note: number
  points?: number
  commentaire?: string
  dateEvaluation: string
  formateur?: {
    nom: string
    prenom: string
  }
  travail?: {
    titre: string
    bareme: number
    type: TypeTravail
  }
  espace?: {
    nom: string
    matiere: string
    promotion: string
  }
}

export interface EtudiantEvaluationsResponse {
  etudiant: {
    id: string
    nom: string
    prenom: string
    matricule: string
  }
  evaluations: Evaluation[]
  stats: {
    totalPoints: number
    moyenneGenerale: number
    nombreEvaluations: number
  }
}

export interface ClassementEtudiant {
  rang: number
  etudiant: {
    id: string
    nom: string
    prenom: string
    matricule: string
    email: string
  }
  totalPoints: number
  nombreEvaluations: number
  moyenneGenerale: number
  meilleureNote: number
  progression: string
}

export interface ClassementResponse {
  promotion: {
    id: string
    nom: string
    annee: string
  }
  classement: ClassementEtudiant[]
  stats: {
    totalEtudiants: number
    moyennePromotion: number
    meilleureMoyenne: number
  }
}

export interface AssignationsListResponse {
  travail: {
    id: string
    titre: string
    type: TypeTravail
    bareme: number
    dateLimite: string
    total: number
    
  }
  assignations: {
    createdAt: string | number | Date
    createdAt: string | number | Date
    createdAt: string | number | Date
    id: string
    etudiant: Etudiant
    statut: StatutAssignation
    dateAssignation: string
    dateLivraison?: string
    evaluation?: {
      id: string
      note: number
      points: number
      dateEvaluation: string
    } | null
  }[]
  total: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface CreateTravailData {
  titre: string
  consignes: string
  type: TypeTravail
  dateLimite: string
  bareme: number
  espacePedagogiqueId: string
}

export interface CreateAssignationData {
  travailId: string
  etudiantId: string
}

export interface CreateEvaluationData {
  assignationId: string
  note: number
  commentaire?: string
}

export interface Livraison {
  id: string
  assignation: Assignation
  fichierUrl?: string
  texte?: string
  dateLivraison: string
}