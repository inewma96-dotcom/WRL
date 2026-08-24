import { NextRequest } from "next/server"
import { apiSuccess, getClientIp, parseJsonBody, withErrorHandling, withRateLimit } from "@/lib/api-utils"
import { checkAuthenticated } from "@/lib/auth-verify"
import { initializePayment } from "@/lib/payments/payment-service"
import { validateCustomer, validateProvider, requireString, optionalString } from "@/lib/payments/validation"
import { PaymentValidationError } from "@/lib/payments/payment-errors"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const ip = getClientIp(request)
  const rateLimit = await withRateLimit(request, `checkout:${ip}`, 12, 60_000)
  if (!rateLimit.allowed && rateLimit.response) return rateLimit.response

  const body = await parseJsonBody<Record<string, unknown>>(request)
  const consent = body.consent === true
  if (!consent) throw new PaymentValidationError("Payment terms consent is required")

  const user = await checkAuthenticated()
  const result = await initializePayment({
    quoteInput: {
      paymentItemSlug: typeof body.paymentItemSlug === "string" ? body.paymentItemSlug : undefined,
      customAmountMinor: typeof body.customAmountMinor === "number" ? body.customAmountMinor : undefined,
      quantity: typeof body.quantity === "number" ? body.quantity : 1,
    },
    customer: validateCustomer((body.customer || {}) as Record<string, unknown>),
    provider: validateProvider(body.provider),
    idempotencyKey: requireString(body.idempotencyKey, "Idempotency key", 120),
    notes: optionalString(body.notes, 1000),
    anonymous: body.anonymous === true,
    userId: user?.id,
  })

  return apiSuccess({
    redirectUrl: result.redirectUrl,
    paymentReference: result.payment.publicReference,
    orderReference: result.order.publicReference,
    idempotent: result.idempotent,
  })
})
