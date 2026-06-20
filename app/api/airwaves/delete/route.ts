import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { requireRole } from "@/lib/auth-verify"

export async function DELETE(req: Request) {
  try {
    // 🔒 PROTECT API
    await requireRole(["ADMIN"])

    const { id } = await req.json()

    await prisma.airwaveContent.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
}