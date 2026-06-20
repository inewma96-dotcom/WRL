import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-verify"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const includeHidden = searchParams.get("includeHidden") === "true"

    if (includeHidden) {
      await requireRole(["ADMIN"])
    }

    const news = await prisma.news.findMany({
      where: includeHidden ? undefined : { isHidden: false },

      include: {
        author: {
          select: {
            username: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(news)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    )
  }
}
