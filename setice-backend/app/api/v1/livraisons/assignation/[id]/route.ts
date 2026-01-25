import { NextRequest, NextResponse } from 'next/server'
import { assignationRepository } from '@/src/repositories/assignation.repository'
import { livraisonRepository } from '@/src/repositories/livraison.repository'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!


async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.verify(token, JWT_SECRET) as any
}

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 [API] POST /api/v1/livraisons - Début')
    
    const user = await getUserFromToken(req)
    console.log('👤 [API] User authentifié:', { userId: user.userId, role: user.role })
    
    if (user.role !== 'ETUDIANT') {
      console.error('❌ [API] Rôle non autorisé:', user.role)
      return NextResponse.json({ success: false, error: 'FORBIDDEN' }, { status: 403 })
    }

    const body = await req.json()
    console.log('📦 [API] Body reçu:', JSON.stringify(body, null, 2))
    
    const { assignationId, texte, fichierUrl } = body

    console.log('🔍 [API] Recherche assignation ID:', assignationId)
    const assignation = await assignationRepository.findById(assignationId)
    
    if (!assignation) {
      console.error('❌ [API] Assignation non trouvée:', assignationId)
      return NextResponse.json({ success: false, error: 'ASSIGNATION_NOT_FOUND' }, { status: 404 })
    }
    
    console.log('✅ [API] Assignation trouvée:', {
      id: assignation.id,
      statutAvant: assignation.statut,
      etudiantId: assignation.etudiant?.id,
      travailTitre: assignation.travail?.titre
    })

    console.log('📝 [API] Création de la livraison...')
    const livraison = await livraisonRepository.createLivraison(assignation, { texte, fichierUrl })
    console.log('✅ [API] Livraison créée:', {
      id: livraison.id,
      assignationId: livraison.assignation?.id,
      dateLivraison: livraison.dateLivraison
    })

    console.log('🔄 [API] Mise à jour du statut de l\'assignation...')
    const assignationUpdated = await assignationRepository.markAsDelivered(assignationId)
    
    if (!assignationUpdated) {
      console.error('❌ [API] Échec de la mise à jour du statut')
      return NextResponse.json({ success: false, error: 'UPDATE_FAILED' }, { status: 500 })
    }
    
    console.log('✅ [API] Statut mis à jour:', {
      id: assignationUpdated.id,
      statutApres: assignationUpdated.statut,
      dateLivraison: assignationUpdated.dateLivraison
    })

    console.log('🔍 [API] Vérification - Rechargement de l\'assignation...')
    const verif = await assignationRepository.findById(assignationId)
    console.log('📊 [API] Statut après rechargement:', verif?.statut)
    
    console.log('🎉 [API] Livraison créée avec succès')
    return NextResponse.json({ success: true, data: livraison }, { status: 201 })
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('❌ [API] Erreur:', err)
    console.error('📍 [API] Stack:', err.stack)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}