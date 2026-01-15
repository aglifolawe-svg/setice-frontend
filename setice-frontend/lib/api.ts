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
} from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("setice_token")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = this.getToken()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Token expiré, redirect login
          if (typeof window !== "undefined") {
            localStorage.removeItem("setice_token")
            localStorage.removeItem("setice_user")
            window.location.href = "/login"
          }
        }
        return { success: false, error: data.error || "Erreur serveur" }
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      return { success: false, error: "Erreur réseau" }
    }
  }

  // Auth
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

  // Formateurs
  async getFormateurs(): Promise<ApiResponse<Formateur[]>> {
    return this.request<Formateur[]>("/formateurs/create")
  }

  async createFormateur(data: CreateFormateurData): Promise<ApiResponse<Formateur>> {
    return this.request<Formateur>("/formateurs/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Promotions
  async getPromotions(): Promise<ApiResponse<Promotion[]>> {
    return this.request<Promotion[]>("/promotions/create")
  }

  async createPromotion(data: CreatePromotionData): Promise<ApiResponse<Promotion>> {
    return this.request<Promotion>("/promotions/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Étudiants
  async getEtudiants(): Promise<ApiResponse<Etudiant[]>> {
    return this.request<Etudiant[]>("/etudiants/create")
  }

  async createEtudiant(data: CreateEtudiantData): Promise<ApiResponse<Etudiant>> {
    return this.request<Etudiant>("/etudiants/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Matières
  async getMatieres(): Promise<ApiResponse<Matiere[]>> {
    return this.request<Matiere[]>("/matieres/create")
  }

  async createMatiere(data: CreateMatiereData): Promise<ApiResponse<Matiere>> {
    return this.request<Matiere>("/matieres/create", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Espaces Pédagogiques
  async getEspaces(): Promise<ApiResponse<EspacePedagogique[]>> {
    return this.request<EspacePedagogique[]>("/espaces-pedagogique/list")
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

  // Dans src/lib/api.ts, dans la classe ApiClient
async getEspaceById(id: string): Promise<ApiResponse<EspacePedagogique>> {
  return this.request<EspacePedagogique>(`/espaces-pedagogique/${id}`)
}

}

export const api = new ApiClient()
