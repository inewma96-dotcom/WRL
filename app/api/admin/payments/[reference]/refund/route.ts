import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-verify"
import { apiSuccess, parseJsonBody, withErrorHandling } from "@/lib/api-utils"
import { getPaymentProvider } from "@/lib/payments/provider-factory"
import { createPublicReference } from "@/lib/payments/references"
import { validatePublicReference } from "@/lib/payments/validation"
import { PaymentValidationError } from "@/lib/payments/payment-errors"

export const POST = withErrorHandling(async (request: NextRequest, context: { params: Promise<{ reference: string }> }) => {
  const admin = await requireRole("ADMIN")
  const { reference } = await context.params
  const body = await parseJsonBody<Record<string, unknown>>(request)
  const amountMinor = Number(body.amountMinor)
  if (!Number.isInteger(amountMinor) || amountMinor < 1) throw new PaymentValidationError("Refund amount is invalid")

  const payment = await prisma.paymentTransaction.findUniqueOrThrow({
    where: { publicReference: validatePublicReference(reference, "Payment reference") },
    include: { refunds: true, order: true },
  })
  if (payment.status !== "SUCCEEDED" && payment.status !== "PARTIALLY_REFUNDED") {
    throw new PaymentValidationError("Only successful payments can be refunded")
  }
  const alreadyRefunded = payment.refunds
    .filter((refund) => refund.status === "SUCCEEDED" || refund.status === "PENDING")
    .reduce((sum, refund) => sum + refund.amountMinor, 0)
  if (alreadyRefunded + amountMinor > payment.amountMinor) throw new PaymentValidationError("Refund exceeds refundable amount")

  const providerResult = await getPaymentProvider(payment.provider as "MOCK" | "BSP" | "KINA").refundTransaction({
    paymentReference: payment.publicReference,
    providerTransactionId: payment.providerTransactionId,
    amountMinor,
    reason: typeof body.reason === "string" ? body.reason : undefined,
  })
  const status = alreadyRefunded + amountMinor === payment.amountMinor ? "REFUNDED" : "PARTIALLY_REFUNDED"

  const refund = await prisma.$transaction(async (tx) => {
    const created = await tx.paymentRefund.create({
      data: {
        publicReference: createPublicReference("RFD"),
        paymentId: payment.id,
        providerRefundId: providerResult.providerRefundId,
        amountMinor,
        status: providerResult.status,
        reason: typeof body.reason === "string" ? body.reason : undefined,
        createdById: admin.id,
      },
    })
    if (providerResult.status === "SUCCEEDED") {
      await tx.paymentTransaction.update({ where: { id: payment.id }, data: { status } })
      await tx.paymentOrder.update({ where: { id: payment.orderId }, data: { status } })
    }
    await tx.paymentAuditLog.create({
      data: {
        paymentId: payment.id,
        orderId: payment.orderId,
        actorUserId: admin.id,
        action: "PAYMENT_REFUND_REQUESTED",
        previousStatus: payment.status,
        newStatus: providerResult.status === "SUCCEEDED" ? status : payment.status,
      },
    })
    return created
  })

  return apiSuccess({ refund })
})
