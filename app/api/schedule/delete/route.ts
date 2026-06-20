import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { enforceAdminApi } from "@/lib/api-security"

export async function DELETE(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN"],
    rateLimit: { key: "schedule-delete", limit: 30, windowMs: 60 * 1000 },
  })
  if (blocked) return blocked

  const { id } = await req.json()

  await prisma.schedule.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
