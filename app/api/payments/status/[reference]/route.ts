import { NextRequest } from "next/server"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"
import { getPaymentStatus } from "@/lib/payments/payment-service"
import { validatePublicReference } from "@/lib/payments/validation"

export const GET = withErrorHandling(async (_request: NextRequest, context: { params: Promise<{ reference: string }> }) => {
  const { reference } = await context.params
  const payment = await getPaymentStatus(validatePublicReference(reference, "Payment reference"))

  return apiSuccess({
    payment: {
      reference: payment.publicReference,
      status: payment.status,
      provider: payment.provider,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
      verifiedAt: payment.verifiedAt?.toISOString() || null,
      failureMessage: payment.failureMessage,
      order: {
        reference: payment.order.publicReference,
        status: payment.order.status,
        purpose: payment.order.purpose,
        description: payment.order.description,
        customerEmail: payment.order.customer.email,
        customerName: payment.order.customer.fullName,
      },
    },
  })
})
