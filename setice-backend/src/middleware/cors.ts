import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Autoriser le frontend
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')

  // Gestion des requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers })
  }

  return res
}

// Appliquer à toutes les routes API
export const config = {
  matcher: '/api/:path*',
}
