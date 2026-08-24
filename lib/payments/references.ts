import crypto from "crypto"

export function createPublicReference(kind: "ORD" | "PAY" | "RFD") {
  const year = new Date().getFullYear()
  const token = crypto.randomBytes(5).toString("hex").toUpperCase()
  return `WRL-${kind}-${year}-${token}`
}

export function createPublicId(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`
}

export function createIdempotencyKey() {
  return crypto.randomBytes(24).toString("hex")
}
