import type {
  AuthResponse,
  ApiResponse,
  Formateur,
  Promotion,
  Etudiant,
  Matiere,
  EspacePedagogique,
  CreateFormateurData,
  CreatePromotionData,
  CreateEtudiantData,
  CreateMatiereData,
  CreateEspaceData,
  AssignFormateurData,
  AddEtudiantsData,
  AddEtudiantsResponse,
  Travail,
  AssignationsListResponse,
  Evaluation,
  CreateEvaluationData,
  EtudiantEvaluationsResponse,
  ClassementResponse,
  CreateAssignationData,
  Assignation,
  Livraison,
} from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://upstack-react-base.onrender.com/api/v1"

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("setice_token")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken()

    const headers: HeadersInit = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    }

    const config: RequestInit = { ...options, headers }

    try {
      console.log("➡️ API Request:", `${API_URL}${endpoint}`, config)
      const response = await fetch(`${API_URL}${endpoint}`, config)

      console.log('⬅️ API Response status:', response.status, response.statusText)

      let data: any = null
      try {
        data = await response.json()
      } catch {
        const text = await response.text()
        console.warn("⚠️ Response non JSON:", text)
        return { success: false, error: 'Non-JSON response' }
      }

      if (!response.ok) {
        console.error('❌ Response error:', data)
        if (response.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("setice_token")
          localStorage.removeItem("setice_user")
          window.location.href = "/login"
        }
        return { success: false, error: data?.error || `Erreur serveur (${response.status})` }
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      return { success: false, error: "Erreur réseau" }
    }
  }

  // -------------------- Auth --------------------
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<{
      token: string
      user: AuthResponse["data"] extends { user: infer U } ? U : never
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    return response as AuthResponse
  }

  // -------------------- Formateurs --------------------
  async getFormateurs(): Promise<ApiResponse<Formateur[]>> {
    return this.request<Formateur[]>("/formateurs/create")
  }

  async createFormateur(data: CreateFormateurData): Promise<ApiResponse<Formateur>> {
    return this.request<Formateur>("/formateurs/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // -------------------- Promotions --------------------
  async getPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.request<Promotion[]>("/promotions/create")
  }

  async createPromotion(data: CreatePromotionData): Promise<ApiResponse<Promotion>> {
    return this.request<Promotion>("/promotions/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // -------------------- Étudiants --------------------
  async getEtudiants(): Promise<ApiResponse<Etudiant[]>> {
    return this.request<Etudiant[]>("/etudiants/create")
  }

  async createEtudiant(data: CreateEtudiantData): Promise<ApiResponse<Etudiant>> {
    return this.request<Etudiant>("/etudiants/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // ✅ NOUVELLE FONCTION DELETE ETUDIANT
  async deleteEtudiant(etudiantId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/etudiants/create?id=${etudiantId}`, {
      method: "DELETE",
    })
  }

  // ✅ NOUVELLE FONCTION UPDATE ETUDIANT
  async updateEtudiant(etudiantId: string, data: {
    nom?: string
    prenom?: string
    email?: string
    promotionId?: string
    matricule?: string
  }): Promise<ApiResponse<Etudiant>> {
    return this.request<Etudiant>("/etudiants/create", {
      method: "PUT",
      body: JSON.stringify({ id: etudiantId, ...data }),
    })
  }

  async getEtudiantsAssignables(espacePedagogiqueId: string): Promise<ApiResponse<Etudiant[]>> {
    console.log("📡 [API] getEtudiantsAssignables - espacePedagogiqueId:", espacePedagogiqueId)
    
    try {
      const espaceResp = await this.getEspaceById(espacePedagogiqueId)
      
      if (espaceResp.success && espaceResp.data?.etudiants) {
        console.log("✅ [API] Étudiants trouvés:", espaceResp.data.etudiants.length)
        return {
          success: true,
          data: espaceResp.data.etudiants
        }
      }
      
      console.warn("⚠️ [API] Aucun étudiant trouvé dans l'espace")
      return {
        success: true,
        data: []
      }
    } catch (error) {
      console.error("❌ [API] Erreur getEtudiantsAssignables:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      }
    }
  }

  // -------------------- Matières --------------------
  async getMatieres(): Promise<ApiResponse<Matiere[]>> {
    return this.request<Matiere[]>("/matieres/create")
  }

  async createMatiere(data: CreateMatiereData): Promise<ApiResponse<Matiere>> {
    return this.request<Matiere>("/matieres/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // -------------------- Espaces pédagogiques --------------------
  async getEspaces(): Promise<ApiResponse<EspacePedagogique[]>> {
    return this.request<EspacePedagogique[]>("/espaces-pedagogique/list")
  }

  async getEspacesByFormateur(): Promise<ApiResponse<EspacePedagogique[]>> {
    return this.request<EspacePedagogique[]>("/formateurs/espaces")
  }

  async createEspace(data: CreateEspaceData): Promise<ApiResponse<EspacePedagogique>> {
    return this.request<EspacePedagogique>("/espaces-pedagogique/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async assignFormateur(data: AssignFormateurData): Promise<ApiResponse<void>> {
    return this.request<void>("/espaces-pedagogique/assign-formateur", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async addEtudiants(data: AddEtudiantsData): Promise<ApiResponse<AddEtudiantsResponse>> {
    return this.request<AddEtudiantsResponse>("/espaces-pedagogique/add-etudiants", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getEspaceById(id: string): Promise<ApiResponse<EspacePedagogique>> {
    return this.request<EspacePedagogique>(`/espaces-pedagogique/${id}`)
  }

  // -------------------- Travaux --------------------
  async getTravauxByEspace(espaceId: string): Promise<ApiResponse<Travail[]>> {
    return this.request<Travail[]>(`/travaux?espaceId=${espaceId}`)
  }

  async createTravail(data: {
    titre: string
    consignes: string
    type: string
    dateLimite: string
    bareme: number
    espacePedagogiqueId: string
  }): Promise<ApiResponse<Travail>> {
    return this.request<Travail>("/travaux/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getTravailById(travailId: string): Promise<ApiResponse<Travail>> {
    return this.request<Travail>(`/travaux/${travailId}`)
  }

  // -------------------- Assignations --------------------
  async createAssignation(data: CreateAssignationData): Promise<ApiResponse<Assignation>> {
    return this.request<Assignation>("/assignations/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAssignations(): Promise<ApiResponse<Assignation[]>> {
    return this.request<Assignation[]>('/assignations')
  }

  async getMyAssignations(): Promise<ApiResponse<Assignation[]>> {
    return this.request<Assignation[]>('/assignations/mes-assignations')
  }

  async getAssignationsByTravail(travailId: string): Promise<ApiResponse<AssignationsListResponse>> {
    return this.request<AssignationsListResponse>(`/assignations/list?travailId=${travailId}`)
  }

  // -------------------- Livraisons --------------------
  async getLivraison(assignationId: string): Promise<ApiResponse<Livraison[] | null>> {
    try {
      return await this.request<Livraison[]>(`/livraisons`)
    } catch {
      return { success: false, data: null, error: 'Erreur réseau' }
    }
  }

  async createLivraison(assignationId: string, data: { texte?: string; fichierUrl?: string }): Promise<ApiResponse<Livraison>> {
    return this.request<Livraison>('/livraisons', {
      method: 'POST',
      body: JSON.stringify({ assignationId, ...data }),
    })
  }

  // -------------------- Évaluations --------------------
  async getMyEvaluations(): Promise<ApiResponse<Evaluation[]>> {
    return this.request<Evaluation[]>('/evaluations/mes')
  }

  async createEvaluation(data: CreateEvaluationData): Promise<ApiResponse<Evaluation>> {
    console.log("🌐 [API] createEvaluation - Données envoyées:", data)
    return this.request<Evaluation>("/evaluations/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getEvaluationsByAssignation(assignationId: string): Promise<ApiResponse<Evaluation[]>> {
    return this.request<Evaluation[]>(`/evaluations?assignationId=${assignationId}`)
  }

  // Dans @/lib/api.ts, ajoutez cette méthode dans la section "Travaux"

   async deleteTravail(travailId: string): Promise<ApiResponse<void>> {
     return this.request<void>(`/travaux/${travailId}`, {
     method: "DELETE",
     })
   }
   async updateTravail(
     travailId: string,
    data: {
    titre: string
    consignes: string
    type: string
    dateLimite: string
    bareme: number
    espacePedagogiqueId: string
    statut: string
  }
): Promise<ApiResponse<Travail>> {
  return this.request<Travail>(`/travaux/${travailId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

  // INSTRUCTIONS: Ajouter ces méthodes à /lib/api.ts dans la classe ApiClient

// -------------------- Classements --------------------
async getClassementPromotions(): Promise<ApiResponse<any[]>> {
  return this.request<any[]>('/classements/promotions')
}

async getClassementPromotion(promotionId: string): Promise<ApiResponse<any>> {
  return this.request<any>(`/classements/${promotionId}`)
}


}


export const api = new ApiClient()