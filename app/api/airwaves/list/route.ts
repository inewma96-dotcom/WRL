import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { enforceAdminApi } from "@/lib/api-security"

export async function GET(req: Request) {
  const blocked = await enforceAdminApi(req)
  if (blocked) return blocked

  try {
    const content = await prisma.airwaveContent.findMany({
      where: { mediaType: "AUDIO" },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
