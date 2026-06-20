import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { enforceAdminApi } from "@/lib/api-security"

export async function POST(req: Request) {
  const blocked = await enforceAdminApi(req, {
    rateLimit: { key: "schedule-create", limit: 60, windowMs: 60 * 1000 },
  })
  if (blocked) return blocked

  const data = await req.json()

  const schedule = await prisma.schedule.create({
    data,
  })

  return NextResponse.json(schedule)
}
