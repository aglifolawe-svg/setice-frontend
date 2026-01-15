import crypto from 'crypto'

export function generateActivationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
