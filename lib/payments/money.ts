import { PaymentValidationError } from "./payment-errors"

export function getPaymentCurrency() {
  return process.env.PAYMENT_CURRENCY || "PGK"
}

export function getPaymentLimits() {
  return {
    minimumAmountMinor: parsePositiveInt(process.env.PAYMENT_MINIMUM_AMOUNT_MINOR, 100),
    maximumAmountMinor: parsePositiveInt(process.env.PAYMENT_MAXIMUM_AMOUNT_MINOR, 100000000),
  }
}

export function assertMinorAmount(value: unknown, label = "Amount") {
  if (!Number.isInteger(value) || typeof value !== "number") {
    throw new PaymentValidationError(`${label} must be an integer minor-unit amount`)
  }

  const { minimumAmountMinor, maximumAmountMinor } = getPaymentLimits()
  if (value < minimumAmountMinor) {
    throw new PaymentValidationError(`${label} must be at least ${formatMoney(minimumAmountMinor)}`)
  }
  if (value > maximumAmountMinor) {
    throw new PaymentValidationError(`${label} exceeds the maximum allowed amount`)
  }
}

export function multiplyMinor(unitAmountMinor: number, quantity: number) {
  if (!Number.isInteger(unitAmountMinor) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new PaymentValidationError("Invalid amount or quantity")
  }
  return unitAmountMinor * quantity
}

export function formatMoney(amountMinor: number, currency = getPaymentCurrency()) {
  const sign = amountMinor < 0 ? "-" : ""
  const absolute = Math.abs(amountMinor)
  const kina = Math.floor(absolute / 100)
  const toea = `${absolute % 100}`.padStart(2, "0")
  return `${sign}${currency} ${kina.toLocaleString("en-PG")}.${toea}`
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}
