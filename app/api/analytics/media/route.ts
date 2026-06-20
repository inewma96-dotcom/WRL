import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkRateLimit, getClientIp } from "@/lib/rate-limit"

type MediaAnalyticsPayload = {
  mediaUrl?: string
  mediaType?: string
  context?: string
  path?: string
}

export async function POST(req: Request) {
  const rateLimit = checkRateLimit(`media-analytics:${getClientIp(req)}`, 120, 60 * 1000)

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const payload = (await req.json()) as MediaAnalyticsPayload

  if (!payload.mediaUrl || !payload.mediaType) {
    return NextResponse.json({ error: "Missing media details" }, { status: 400 })
  }

  await prisma.mediaPlaybackEvent.create({
    data: {
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      context: payload.context,
      path: payload.path,
      userAgent: req.headers.get("user-agent"),
    },
  })

  return NextResponse.json({ success: true })
}
