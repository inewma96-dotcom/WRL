import { NextRequest } from "next/server"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"
import { KinaPaymentProvider } from "@/lib/payments/kina-provider"
import { applyVerifiedCallback } from "@/lib/payments/payment-service"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const callback = await new KinaPaymentProvider().verifyCallback(request)
  const result = await applyVerifiedCallback(callback)
  return apiSuccess({ processed: true, duplicate: result.duplicate })
})
