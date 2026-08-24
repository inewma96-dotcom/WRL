import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-verify"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"

export const GET = withErrorHandling(async (request: NextRequest) => {
  await requireRole("ADMIN")
  const search = request.nextUrl.searchParams.get("search") || undefined
  const status = request.nextUrl.searchParams.get("status") || undefined
  const provider = request.nextUrl.searchParams.get("provider") || undefined
  const purpose = request.nextUrl.searchParams.get("purpose") || undefined

  const where = {
    ...(status ? { status } : {}),
    ...(provider ? { provider } : {}),
    ...(purpose ? { order: { purpose } } : {}),
    ...(search
      ? {
          OR: [
            { publicReference: { contains: search } },
            { providerTransactionId: { contains: search } },
            { order: { publicReference: { contains: search } } },
            { order: { customer: { fullName: { contains: search } } } },
            { order: { customer: { email: { contains: search } } } },
          ],
        }
      : {}),
  }

  const [payments, succeeded, pending, failed, refunded] = await Promise.all([
    prisma.paymentTransaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { order: { include: { customer: true } } },
    }),
    prisma.paymentTransaction.aggregate({ where: { status: "SUCCEEDED" }, _sum: { amountMinor: true }, _count: true }),
    prisma.paymentTransaction.count({ where: { status: { in: ["CREATED", "PENDING", "PROCESSING", "REQUIRES_ACTION"] } } }),
    prisma.paymentTransaction.count({ where: { status: "FAILED" } }),
    prisma.paymentTransaction.count({ where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } } }),
  ])

  return apiSuccess({
    summary: {
      successfulAmountMinor: succeeded._sum.amountMinor || 0,
      successfulCount: succeeded._count,
      pendingCount: pending,
      failedCount: failed,
      refundedCount: refunded,
    },
    payments,
  })
})
