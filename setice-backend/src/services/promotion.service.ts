console.log('🟠 [SERVICE-PROMOTION] 1. Début chargement promotion.service.ts')

import { promotionRepository } from '../repositories/promotion.repository'

console.log('🟠 [SERVICE-PROMOTION] 2. Repository importé avec succès')

export async function createPromotion(input: {
  code: string
  libelle: string
  annee: string
}) {
  console.log('🟠 [SERVICE-PROMOTION] createPromotion appelé avec:', input)
  
  const exists = await promotionRepository.findByCode(input.code)
  if (exists) {
    console.log('⚠️ [SERVICE-PROMOTION] Promotion existe déjà:', input.code)
    throw new Error('PROMOTION_ALREADY_EXISTS')
  }

  console.log('🟠 [SERVICE-PROMOTION] Création de la promotion...')
  return promotionRepository.create(input)
}

export async function getPromotions() {
  console.log('🟠 [SERVICE-PROMOTION] getPromotions appelé')
  return promotionRepository.findAll()
}

console.log('✅ [SERVICE-PROMOTION] 3. Service défini avec succès')