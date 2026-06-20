import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-verify"

export async function PATCH(req: Request) {
  try {
    const user = await requireRole(["ADMIN", "JOURNALIST"])

    const { id } = await req.json()

    const post = await prisma.news.findUnique({
      where: { id },
    })

    if (!post) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      )
    }

    ////////////////////////////////////////////////////
    // 🔒 OWNERSHIP CHECK
    ////////////////////////////////////////////////////

    if (
      user.role === "JOURNALIST" &&
      post.authorId !== user.id
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        isHidden: !post.isHidden,
      },
    })

    return NextResponse.json(updated)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    )
  }
}