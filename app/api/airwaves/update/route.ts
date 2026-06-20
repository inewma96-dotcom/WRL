import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-verify"

export async function PATCH(
  req: Request
) {
  try {
    //////////////////////////////////////////////////////
    // AUTH
    //////////////////////////////////////////////////////

    await requireRole([
      "ADMIN",
    ])

    //////////////////////////////////////////////////////
    // BODY
    //////////////////////////////////////////////////////

    const {
      id,
      title,
      description,
    } = await req.json()

    //////////////////////////////////////////////////////
    // UPDATE
    //////////////////////////////////////////////////////

    const updated =
      await prisma.airwaveContent.update(
        {
          where: { id },

          data: {
            title,
            description,
          },
        }
      )

    return NextResponse.json(
      updated
    )

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error:
          "Failed to update audio",
      },
      { status: 500 }
    )
  }
}