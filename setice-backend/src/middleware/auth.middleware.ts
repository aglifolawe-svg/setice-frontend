import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function verifyToken(authHeader: string | null): JwtPayload {
  if (!authHeader) {
    throw new Error('MISSING_TOKEN')
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('INVALID_TOKEN_FORMAT')
  }

  const token = authHeader.substring(7) // Enlever "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('INVALID_TOKEN')
  }
}

export function requireAuth(req: Request) {
  const authHeader = req.headers.get('Authorization')
  return verifyToken(authHeader)
}

export function requireRole(req: Request, allowedRoles: string[]) {
  const user = requireAuth(req)
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN')
  }
  
  return user
}