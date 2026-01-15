export function generateMatricule(promotionCode: string, count: number) {
  const year = new Date().getFullYear()       // Année actuelle
  return `${year}-${promotionCode}-${String(count + 1).padStart(5, '0')}`
}
