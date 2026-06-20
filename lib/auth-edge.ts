import { isUserRole, type UserRole } from "@/lib/constants"

export const AUTH_COOKIE_NAME = "wrl_auth_token"

function base64UrlDecode(value: string): string {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=")
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/")
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function base64UrlToUint8Array(value: string): Uint8Array {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=")
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(base64)
  const buffer = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i)
  }

  return buffer
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

async function verifyHmacSha256Signature(
  token: string,
  secret: string
): Promise<boolean> {
  const parts = token.split(".")
  if (parts.length !== 3) return false

  const signingInput = `${parts[0]}.${parts[1]}`
  const signature = base64UrlToUint8Array(parts[2])
  const encodedSecret = new TextEncoder().encode(secret)
  const encodedSigningInput = new TextEncoder().encode(signingInput)
  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(encodedSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )

  return crypto.subtle.verify(
    "HMAC",
    key,
    toArrayBuffer(signature),
    toArrayBuffer(encodedSigningInput)
  )
}

export interface EdgeJWTPayload {
  userId: string
  email: string
  role: UserRole
  sessionId: string
  iat: number
  exp: number
}

export async function verifyAccessTokenEdge(
  token: string,
  secret: string
): Promise<EdgeJWTPayload | null> {
  if (!token || !secret) {
    return null
  }

  const parts = token.split(".")
  if (parts.length !== 3) {
    return null
  }

  let payloadJson: string
  try {
    payloadJson = base64UrlDecode(parts[1])
  } catch {
    return null
  }

  let payload: unknown
  try {
    payload = JSON.parse(payloadJson)
  } catch {
    return null
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    typeof (payload as any).userId !== "string" ||
    typeof (payload as any).email !== "string" ||
    typeof (payload as any).role !== "string" ||
    !isUserRole((payload as any).role) ||
    typeof (payload as any).sessionId !== "string" ||
    typeof (payload as any).exp !== "number"
  ) {
    return null
  }

  if ((payload as any).exp < Math.floor(Date.now() / 1000)) {
    return null
  }

  const validSignature = await verifyHmacSha256Signature(token, secret)
  if (!validSignature) {
    return null
  }

  return payload as EdgeJWTPayload
}
