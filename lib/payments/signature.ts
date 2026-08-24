import crypto from "crypto"

export function hmacSha256(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}

export function constantTimeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

export function sha256(payload: string) {
  return crypto.createHash("sha256").update(payload).digest("hex")
}
