import crypto from "crypto"
import { getBaseUrl, getMerchantName, getMockSecret } from "./env"
import { PaymentProviderError } from "./payment-errors"
import { hmacSha256, sha256, constantTimeEqual } from "./signature"
import { sanitizeMetadata } from "./sanitization"
import type {
  CreatePaymentSessionInput,
  CreatePaymentSessionResult,
  PaymentStatus,
  QueryPaymentInput,
  QueryPaymentResult,
  RefundPaymentInput,
  RefundPaymentResult,
  VerifiedPaymentCallback,
} from "./types"
import { prisma } from "@/lib/prisma"

const MOCK_SESSION_TTL_MS = 30 * 60 * 1000

export class MockPaymentProvider {
  async createPaymentSession(input: CreatePaymentSessionInput): Promise<CreatePaymentSessionResult> {
    const providerSessionId = `mock_${crypto.randomBytes(12).toString("hex")}`
    const expiresAt = new Date(Date.now() + MOCK_SESSION_TTL_MS)
    const baseUrl = getBaseUrl()

    return {
      provider: "MOCK",
      providerSessionId,
      redirectUrl: `${baseUrl}/api/payments/mock/hosted/${input.paymentReference}`,
      expiresAt,
      responseMetadata: {
        providerSessionId,
        merchantName: getMerchantName(),
        expiresAt: expiresAt.toISOString(),
      },
    }
  }

  async verifyCallback(request: Request): Promise<VerifiedPaymentCallback> {
    const rawBody = await request.text()
    const signature = request.headers.get("x-wrl-mock-signature") || ""
    const expectedSignature = hmacSha256(rawBody, getMockSecret())

    if (!constantTimeEqual(signature, expectedSignature)) {
      throw new PaymentProviderError("Invalid mock payment signature", 400)
    }

    const payload = JSON.parse(rawBody) as Record<string, unknown>
    const status = String(payload.status || "PENDING").toUpperCase() as PaymentStatus
    const eventId = String(payload.eventId || "")
    const paymentReference = String(payload.paymentReference || "")
    const orderReference = String(payload.orderReference || "")
    const amountMinor = Number(payload.amountMinor)
    const currency = String(payload.currency || "PGK")

    return {
      provider: "MOCK",
      eventType: `mock.payment.${status.toLowerCase()}`,
      providerEventId: eventId,
      paymentReference,
      orderReference,
      providerTransactionId: String(payload.providerTransactionId || ""),
      status,
      amountMinor,
      currency,
      signatureValid: true,
      payloadHash: sha256(rawBody),
      sanitizedPayload: sanitizeMetadata(payload),
    }
  }

  async queryTransaction(input: QueryPaymentInput): Promise<QueryPaymentResult> {
    const payment = await prisma.paymentTransaction.findUnique({
      where: { publicReference: input.paymentReference },
    })
    if (!payment) throw new PaymentProviderError("Mock payment not found", 404)

    return {
      status: payment.status as PaymentStatus,
      providerTransactionId: payment.providerTransactionId || undefined,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      responseMetadata: { source: "mock-local-database" },
    }
  }

  async refundTransaction(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      status: "SUCCEEDED",
      providerRefundId: `mock_refund_${crypto.randomBytes(10).toString("hex")}`,
      responseMetadata: {
        paymentReference: input.paymentReference,
        amountMinor: input.amountMinor,
        reason: input.reason,
      },
    }
  }
}

export function createMockCallbackPayload(input: {
  paymentReference: string
  orderReference: string
  amountMinor: number
  currency: string
  status: PaymentStatus
}) {
  const payload = {
    eventId: `mock_evt_${crypto.randomBytes(12).toString("hex")}`,
    paymentReference: input.paymentReference,
    orderReference: input.orderReference,
    amountMinor: input.amountMinor,
    currency: input.currency,
    status: input.status,
    providerTransactionId: `mock_txn_${crypto.randomBytes(12).toString("hex")}`,
    merchantName: getMerchantName(),
    timestamp: new Date().toISOString(),
  }
  const rawBody = JSON.stringify(payload)
  return {
    rawBody,
    signature: hmacSha256(rawBody, getMockSecret()),
  }
}
