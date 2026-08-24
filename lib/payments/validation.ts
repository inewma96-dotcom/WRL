import { PAYMENT_PROVIDERS, PAYMENT_PURPOSES, type CustomerInput, type PaymentProviderCode, type PaymentPurpose } from "./types"
import { PaymentValidationError } from "./payment-errors"

export const PNG_PROVINCES = [
  "National Capital District",
  "Central",
  "Gulf",
  "Western",
  "Milne Bay",
  "Oro",
  "Morobe",
  "Madang",
  "East Sepik",
  "West Sepik",
  "Eastern Highlands",
  "Western Highlands",
  "Southern Highlands",
  "Enga",
  "Hela",
  "Jiwaka",
  "Chimbu",
  "East New Britain",
  "West New Britain",
  "New Ireland",
  "Manus",
  "Autonomous Region of Bougainville",
]

export function requireString(value: unknown, label: string, max = 200) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new PaymentValidationError(`${label} is required`)
  }
  const trimmed = value.trim()
  if (trimmed.length > max) throw new PaymentValidationError(`${label} is too long`)
  return trimmed
}

export function optionalString(value: unknown, max = 500) {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value !== "string") throw new PaymentValidationError("Invalid text value")
  const trimmed = value.trim()
  if (trimmed.length > max) throw new PaymentValidationError("Text value is too long")
  return trimmed
}

export function validateEmail(value: unknown) {
  const email = requireString(value, "Email", 254).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new PaymentValidationError("Enter a valid email address")
  }
  return email
}

export function normalizePngPhone(value: unknown) {
  const phone = optionalString(value, 32)
  if (!phone) return undefined
  const compact = phone.replace(/[\s-]/g, "")
  const match = compact.match(/^(?:\+675|0)?([78]\d{7})$/)
  if (!match) {
    throw new PaymentValidationError("Enter a valid PNG mobile number")
  }
  return `+675${match[1]}`
}

export function validateCustomer(input: Record<string, unknown>): CustomerInput {
  return {
    fullName: requireString(input.fullName, "Full name", 120),
    email: validateEmail(input.email),
    phone: normalizePngPhone(input.phone),
    country: optionalString(input.country, 80) || "Papua New Guinea",
    province: optionalString(input.province, 80),
    city: requireString(input.city, "City or town", 80),
    postalCode: optionalString(input.postalCode, 20),
    billingAddress: requireString(input.billingAddress, "Billing address", 240),
  }
}

export function validateProvider(value: unknown): PaymentProviderCode {
  const provider = String(value || "").toUpperCase()
  if (!PAYMENT_PROVIDERS.includes(provider as PaymentProviderCode)) {
    throw new PaymentValidationError("Unsupported payment provider")
  }
  return provider as PaymentProviderCode
}

export function validatePurpose(value: unknown): PaymentPurpose {
  const purpose = String(value || "GENERAL_DONATION").toUpperCase()
  if (!PAYMENT_PURPOSES.includes(purpose as PaymentPurpose)) {
    throw new PaymentValidationError("Unsupported payment purpose")
  }
  return purpose as PaymentPurpose
}

export function validatePublicReference(value: unknown, label = "Reference") {
  const reference = requireString(value, label, 40)
  if (!/^WRL-(ORD|PAY|RFD)-\d{4}-[A-F0-9]{10}$/.test(reference)) {
    throw new PaymentValidationError(`Invalid ${label.toLowerCase()}`)
  }
  return reference
}
