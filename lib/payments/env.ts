import { PaymentConfigurationError } from "./payment-errors"
import type { PaymentProviderCode } from "./types"

export function getMerchantName() {
  return process.env.PAYMENT_MERCHANT_NAME || "Wantok Radio Light"
}

export function getBaseUrl() {
  return process.env.MOCK_PAYMENT_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
}

export function getDefaultPaymentProvider(): PaymentProviderCode {
  const raw = (process.env.PAYMENT_PROVIDER || "mock").toUpperCase()
  if (raw === "BSP" || raw === "KINA" || raw === "MOCK") return raw
  return "MOCK"
}

export function getMockSecret() {
  const secret = process.env.MOCK_PAYMENT_SECRET || "replace-with-a-long-random-secret"
  if (process.env.NODE_ENV === "production" && secret === "replace-with-a-long-random-secret") {
    throw new PaymentConfigurationError("MOCK_PAYMENT_SECRET must be changed in production")
  }
  return secret
}

export function requireProviderConfig(provider: "BSP" | "KINA") {
  const prefix = `${provider}_IPG`
  const required = ["BASE_URL", "MERCHANT_ID", "TERMINAL_ID", "API_KEY", "API_SECRET", "CALLBACK_SECRET", "RETURN_URL"]
  const missing = required.filter((key) => !process.env[`${prefix}_${key}`])
  if (missing.length > 0) {
    throw new PaymentConfigurationError(`${provider} payment gateway is not configured. Missing: ${missing.join(", ")}`)
  }
}
