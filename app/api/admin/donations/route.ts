import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/auth-verify"
import { apiSuccess, withErrorHandling } from "@/lib/api-utils"

export const GET = withErrorHandling(async () => {
  await requireRole("ADMIN")
  const donations = await prisma.paymentOrder.findMany({
    where: { purpose: { in: ["GENERAL_DONATION", "MINISTRY_SUPPORT", "PROJECT_SUPPORT", "PROGRAM_SPONSORSHIP"] } },
    orderBy: { createdAt: "desc" },
    include: { customer: true, transactions: true },
    take: 100,
  })
  return apiSuccess({ donations })
})
