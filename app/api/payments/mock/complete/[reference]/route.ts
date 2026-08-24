import { NextRequest, NextResponse } from "next/server"
import { createMockCallbackPayload } from "@/lib/payments/mock-provider"
import { applyVerifiedCallback } from "@/lib/payments/payment-service"
import { MockPaymentProvider } from "@/lib/payments/mock-provider"
import { getPaymentStatus } from "@/lib/payments/payment-service"
import { validatePublicReference } from "@/lib/payments/validation"
import type { PaymentStatus } from "@/lib/payments/types"

const STATUS_BY_ACTION: Record<string, PaymentStatus> = {
  approve: "SUCCEEDED",
  decline: "FAILED",
  cancel: "CANCELLED",
  pending: "PENDING",
}

export async function GET(request: NextRequest, context: { params: Promise<{ reference: string }> }) {
  const { reference } = await context.params
  const payment = await getPaymentStatus(validatePublicReference(reference, "Payment reference"))
  const action = request.nextUrl.searchParams.get("action") || "pending"
  const status = STATUS_BY_ACTION[action] || "PENDING"

  const signed = createMockCallbackPayload({
    paymentReference: payment.publicReference,
    orderReference: payment.order.publicReference,
    amountMinor: payment.amountMinor,
    currency: payment.currency,
    status,
  })
  const callbackRequest = new Request(`${request.nextUrl.origin}/api/payments/mock/callback`, {
    method: "POST",
    headers: { "x-wrl-mock-signature": signed.signature },
    body: signed.rawBody,
  })
  const callback = await new MockPaymentProvider().verifyCallback(callbackRequest)
  await applyVerifiedCallback(callback)

  return NextResponse.redirect(new URL(`/payment/processing?reference=${payment.publicReference}`, request.url))
}
