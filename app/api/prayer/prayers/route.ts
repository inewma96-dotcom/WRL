import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { enforceAdminApi } from "@/lib/api-security"
import { deleteExpiredPrayerRequests } from "@/lib/prayer-requests"

export async function GET(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["PRAYER", "ADMIN"],
  })

  if (blocked) return blocked

  await deleteExpiredPrayerRequests()

  const prayers =
    await prisma.prayerRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })

  return NextResponse.json(prayers)
}

export async function PATCH(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["PRAYER", "ADMIN"],
  })

  if (blocked) return blocked

  const { id } = await req.json()

  const prayer =
    await prisma.prayerRequest.update({
      where: { id },

      data: {
        status: "PRAYED",
        isRead: true,
      },
    })

  return NextResponse.json(prayer)
}

export async function DELETE(req: Request) {
  const blocked = await enforceAdminApi(req, {
    roles: ["PRAYER", "ADMIN"],
  })

  if (blocked) return blocked

  const { id } = await req.json()

  await prisma.prayerRequest.delete({
    where: { id },
  })

  return NextResponse.json({
    success: true,
  })
}
