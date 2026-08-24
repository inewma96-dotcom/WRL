import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-verify"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"

export const GET = withErrorHandling(async () => {
  await requireRole("ADMIN")
  const orders = await prisma.paymentOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, items: true, transactions: true },
    take: 100,
  })
  return apiSuccess({ orders })
})
