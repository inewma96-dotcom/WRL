import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { enforceAdminApi } from "@/lib/api-security"

export async function PATCH(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["ADMIN", "JOURNALIST"],
    rateLimit: { key: "news-update", limit: 60, windowMs: 60 * 1000 },
  })
  if (blocked) return blocked

  const { id, title, content } = await req.json()

  const updated = await prisma.news.update({
    where: { id },
    data: { title, content },
  })

  return NextResponse.json(updated)
}
