import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

import { requireRole } from "@/lib/auth-verify"
import {
  apiError,
  withErrorHandling,
} from "@/lib/api-utils"
import { deleteExpiredPrayerRequests } from "@/lib/prayer-requests"
import { prisma } from "@/lib/prisma"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function listPrayerRequestsHandler(
  _req: NextRequest
) {
  await requireRole(["ADMIN", "PRAYER"])
  await deleteExpiredPrayerRequests()

  const requests =
    await prisma.prayerRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

  return NextResponse.json(
    requests
  )
}

export const GET = withErrorHandling(
  listPrayerRequestsHandler
)

export const POST = () =>
  apiError(new Error("Method not allowed"))
