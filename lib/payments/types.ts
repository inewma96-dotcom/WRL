export const PAYMENT_PURPOSES = [
  "GENERAL_DONATION",
  "PROGRAM_SPONSORSHIP",
  "PROJECT_SUPPORT",
  "MINISTRY_SUPPORT",
  "MERCHANDISE",
  "SERVICE",
  "OTHER",
] as const

export const PAYMENT_PROVIDERS = ["MOCK", "BSP", "KINA"] as const

export const PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "REQUIRES_ACTION",
  "PROCESSING",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const

export const ORDER_STATUSES = [
  "DRAFT",
  "PENDING_PAYMENT",
  "PROCESSING",
  "PAID",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const

export type PaymentPurpose = (typeof PAYMENT_PURPOSES)[number]
export type PaymentProviderCode = (typeof PAYMENT_PROVIDERS)[number]
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type PaymentQuoteInput = {
  paymentItemSlug?: string
  customAmountMinor?: number
  quantity?: number
}

export type PaymentQuote = {
  productId?: string
  productSlug?: string
  purpose: PaymentPurpose
  description: string
  currency: string
  quantity: number
  unitPriceMinor: number
  subtotalMinor: number
  processingFeeMinor: number
  totalMinor: number
}

export type CustomerInput = {
  fullName: string
  email: string
  phone?: string
  country?: string
  province?: string
  city?: string
  postalCode?: string
  billingAddress?: string
}

export type CreatePaymentSessionInput = {
  orderReference: string
  paymentReference: string
  amountMinor: number
  currency: string
  description: string
  customer: CustomerInput
  returnUrl: string
  callbackUrl: string
}

export type CreatePaymentSessionResult = {
  provider: PaymentProviderCode
  providerSessionId: string
  redirectUrl: string
  responseMetadata?: unknown
  expiresAt?: Date
}

export type VerifiedPaymentCallback = {
  provider: PaymentProviderCode
  eventType: string
  providerEventId: string
  paymentReference: string
  orderReference: string
  providerTransactionId?: string
  status: PaymentStatus
  amountMinor: number
  currency: string
  signatureValid: boolean
  payloadHash: string
  sanitizedPayload: unknown
}

export type QueryPaymentInput = {
  paymentReference: string
  providerTransactionId?: string | null
}

export type QueryPaymentResult = {
  status: PaymentStatus
  providerTransactionId?: string
  amountMinor?: number
  currency?: string
  responseMetadata?: unknown
}

export type RefundPaymentInput = {
  paymentReference: string
  providerTransactionId?: string | null
  amountMinor: number
  reason?: string
}

export type RefundPaymentResult = {
  status: "SUCCEEDED" | "PENDING" | "FAILED"
  providerRefundId?: string
  responseMetadata?: unknown
}
