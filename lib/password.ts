import crypto from "crypto"

const SCRYPT_KEYLEN = 64
const SCRYPT_SALT_BYTES = 16
const SCRYPT_OPTIONS = {
  N: 16384,
  r: 8,
  p: 1,
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(SCRYPT_SALT_BYTES).toString("hex")
  const derived = crypto.scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS).toString("hex")
  return `scrypt$${salt}$${derived}`
}

export function verifyPassword(plain: string, hashed: string) {
  if (!hashed) return false

  if (hashed.startsWith("scrypt$")) {
    const parts = hashed.split("$")
    if (parts.length !== 3) return false

    const [, salt, storedDerived] = parts
    const derived = crypto.scryptSync(plain, salt, SCRYPT_KEYLEN, SCRYPT_OPTIONS).toString("hex")
    return derived === storedDerived
  }

  return plain === hashed
}
