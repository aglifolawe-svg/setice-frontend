import { z } from 'zod'

export const createFormateurSchema = z.object({
  nom: z.string().min(1),
  prenom: z.string().min(1),
  email: z.string().email(),
  specialite: z.string().optional(),
})

export type CreateFormateurInput = z.infer<typeof createFormateurSchema>
