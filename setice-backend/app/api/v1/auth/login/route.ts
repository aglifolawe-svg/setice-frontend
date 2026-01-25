export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { login } from '@/src/services/auth.service'
import { loginSchema } from '@/src/schemas/login.schema'

export async function POST(req: Request) {
  try {
    console.log('🔵 [LOGIN] Début de la requête de connexion')
    
    const body = await req.json()
    console.log('🔵 [LOGIN] Body reçu:', { email: body.email })
    
    const data = loginSchema.parse(body)
    console.log('🔵 [LOGIN] Données validées par Zod')

    const result = await login(data.email, data.password)
    console.log('✅ [LOGIN] Connexion réussie pour:', data.email)

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error('❌ [LOGIN] Erreur capturée:', {
      name: e.name,
      message: e.message,
      stack: e.stack
    })

    if (e.message === 'INVALID_CREDENTIALS') {
      return NextResponse.json(
        { success: false, error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    if (e.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: e.errors },
        { status: 400 }
      )
    }

    // ✅ Log l'erreur complète pour debug
    return NextResponse.json(
      { success: false, error: e.message || 'Erreur serveur' },
      { status: 400 }
    )
  }
}