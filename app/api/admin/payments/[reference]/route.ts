import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-verify"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"
import { validatePublicReference } from "@/lib/payments/validation"

export const GET = withErrorHandling(async (_request: NextRequest, context: { params: Promise<{ reference: string }> }) => {
  await requireRole("ADMIN")
  const { reference } = await context.params
  const payment = await prisma.paymentTransaction.findUnique({
    where: { publicReference: validatePublicReference(reference, "Payment reference") },
    include: {
      order: { include: { customer: true, items: true } },
      events: { orderBy: { receivedAt: "desc" } },
      refunds: { orderBy: { createdAt: "desc" } },
      auditLogs: { orderBy: { createdAt: "desc" } },
    },
  })
  return apiSuccess({ payment })
})
