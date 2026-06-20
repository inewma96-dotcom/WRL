import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-verify"

export async function DELETE(req: Request) {
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

    await prisma.news.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    )
  }
}