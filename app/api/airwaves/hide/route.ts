import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-verify"

export async function PATCH(req: Request) {
  try {
    // 🔒 PROTECT API
    await requireRole(["ADMIN"])

    const { id } = await req.json()

    const item = await prisma.airwaveContent.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      )
    }

    const updated = await prisma.airwaveContent.update({
      where: { id },
      data: {
        isHidden: !item.isHidden,
      },
    })

    return NextResponse.json(updated)

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}