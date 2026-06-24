import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const SECRET_KEY = process.env.ENCRYPTION_KEY
const IV_LENGTH = 16
const SALT = process.env.ENCRYPTION_SALT || 'default-salt-do-not-use-in-prod'

if (!SECRET_KEY) {
  console.warn('WARNING: ENCRYPTION_KEY is not set in environment variables. Falling back to a random key. This will cause decryption to fail after server restarts!')
}

const FINAL_SECRET = SECRET_KEY || 'a-very-secret-fallback-key-for-dev-only'

export function encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(IV_LENGTH)
  const key = crypto.scryptSync(FINAL_SECRET, SALT, 32)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

export function decrypt(encrypted: string, iv: string, authTag: string): string {
  const key = crypto.scryptSync(FINAL_SECRET, SALT, 32)
  const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'))
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
