import { NextRequest } from "next/server"
import { apiSuccess, parseJsonBody, withErrorHandling } from "@/lib/api-utils"
import { getPaymentQuote } from "@/lib/payments/payment-service"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await parseJsonBody<Record<string, unknown>>(request)
  const quote = await getPaymentQuote({
    paymentItemSlug: typeof body.paymentItemSlug === "string" ? body.paymentItemSlug : undefined,
    customAmountMinor: typeof body.customAmountMinor === "number" ? body.customAmountMinor : undefined,
    quantity: typeof body.quantity === "number" ? body.quantity : 1,
  })
  return apiSuccess({ quote })
})
