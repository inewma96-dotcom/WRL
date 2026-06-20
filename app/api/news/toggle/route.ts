import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { enforceAdminApi } from "@/lib/api-security"

export async function PATCH(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN", "JOURNALIST"],
    rateLimit: { key: "news-toggle", limit: 60, windowMs: 60 * 1000 },
  })
  if (blocked) return blocked

  const { id } = await req.json()

  const item = await prisma.news.findUnique({ where: { id } })

  const updated = await prisma.news.update({
    where: { id },
    data: { isHidden: !item?.isHidden },
  })

  return NextResponse.json(updated)
}
