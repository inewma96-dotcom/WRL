const SENSITIVE_KEY_PATTERN = /(card|pan|cvv|cvc|pin|password|secret|authorization|token|apiKey|api_key|accessKey|privateKey)/i

export function sanitizeMetadata(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeMetadata(item))
  }

  if (input && typeof input === "object") {
    return Object.fromEntries(
      Object.entries(input as Record<string, unknown>).map(([key, value]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? "[REDACTED]" : sanitizeMetadata(value),
      ])
    )
  }

  return input
}

export function stringifySanitized(input: unknown) {
  return JSON.stringify(sanitizeMetadata(input) ?? null)
}
