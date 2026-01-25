console.log('🟣 [SCHEMA-PROMOTION] 1. Début chargement promotion.schema.ts')

import { z } from 'zod'

console.log('🟣 [SCHEMA-PROMOTION] 2. Zod importé avec succès')

export const createPromotionSchema = z.object({
  code: z.string().min(1),
  libelle: z.string().min(1),
  annee: z.string().min(4),
})

console.log('🟣 [SCHEMA-PROMOTION] 3. Schema défini avec succès')

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>

console.log('✅ [SCHEMA-PROMOTION] 4. Type exporté avec succès')