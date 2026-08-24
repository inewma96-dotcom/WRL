import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-verify"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"
import { getPaymentProvider } from "@/lib/payments/provider-factory"
import { validatePublicReference } from "@/lib/payments/validation"
import { stringifySanitized } from "@/lib/payments/sanitization"

export const POST = withErrorHandling(async (_request: NextRequest, context: { params: Promise<{ reference: string }> }) => {
  const admin = await requireRole("ADMIN")
  const { reference } = await context.params
  const payment = await prisma.paymentTransaction.findUniqueOrThrow({
    where: { publicReference: validatePublicReference(reference, "Payment reference") },
    include: { order: true },
  })
  const result = await getPaymentProvider(payment.provider as "MOCK" | "BSP" | "KINA").queryTransaction({
    paymentReference: payment.publicReference,
    providerTransactionId: payment.providerTransactionId,
  })
  await prisma.paymentAuditLog.create({
    data: {
      paymentId: payment.id,
      orderId: payment.orderId,
      actorUserId: admin.id,
      action: "PAYMENT_STATUS_VERIFIED_WITH_PROVIDER",
      previousStatus: payment.status,
      newStatus: result.status,
      metadata: stringifySanitized(result.responseMetadata),
    },
  })
  return apiSuccess({ result })
})
