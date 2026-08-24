import { apiSuccess, withErrorHandling } from "@/lib/api-utils"
import { getDefaultPaymentProvider } from "@/lib/payments/env"

export const GET = withErrorHandling(async () => {
  const bspConfigured = Boolean(process.env.BSP_IPG_BASE_URL && process.env.BSP_IPG_MERCHANT_ID && process.env.BSP_IPG_API_KEY)
  const kinaConfigured = Boolean(process.env.KINA_IPG_BASE_URL && process.env.KINA_IPG_MERCHANT_ID && process.env.KINA_IPG_API_KEY)

  return apiSuccess({
    defaultProvider: getDefaultPaymentProvider(),
    providers: [
      {
        code: "MOCK",
        name: "Test Payment Gateway",
        available: process.env.NODE_ENV !== "production" || getDefaultPaymentProvider() === "MOCK",
        testMode: true,
      },
      {
        code: "BSP",
        name: "BSP Internet Payment Gateway",
        available: bspConfigured,
        testMode: false,
      },
      {
        code: "KINA",
        name: "Kina Bank Internet Payment Gateway",
        available: kinaConfigured,
        testMode: false,
      },
    ],
  })
})
