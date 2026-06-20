import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-verify"
import { AppError, apiError, withRateLimit } from "@/lib/api-utils"
import type { UserRole } from "@/lib/constants"
import type { NextRequest } from "next/server"

type Options = {
  roles?: UserRole[]
  rateLimit?: {
    key: string
    limit: number
    windowMs: number
  }
}

export async function enforceAdminApi(
  req: Request,
  options?: Options
) {
  try {
    await requireRole(options?.roles ?? ["ADMIN"])

    if (options?.rateLimit) {
      const rateLimit = await withRateLimit(
        req as NextRequest,
        options.rateLimit.key,
        options.rateLimit.limit,
        options.rateLimit.windowMs
      )

      if (!rateLimit.allowed) {
        return rateLimit.response
      }
    }

    return null

  } catch (err) {
    console.error(err)

    if (err instanceof AppError) {
      return apiError(err)
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
