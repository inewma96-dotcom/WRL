import { NextRequest } from "next/server"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"
import { BspPaymentProvider } from "@/lib/payments/bsp-provider"
import { applyVerifiedCallback } from "@/lib/payments/payment-service"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const callback = await new BspPaymentProvider().verifyCallback(request)
  const result = await applyVerifiedCallback(callback)
  return apiSuccess({ processed: true, duplicate: result.duplicate })
})
