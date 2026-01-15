import { promotionRepository } from '../repositories/promotion.repository'


export async function createPromotion(input: {
code: string
libelle: string
annee: string
}) {
const exists = await promotionRepository.findByCode(input.code)
if (exists) throw new Error('PROMOTION_ALREADY_EXISTS')


return promotionRepository.create(input)
}

export async function getPromotions() {
  return promotionRepository.findAll()
}