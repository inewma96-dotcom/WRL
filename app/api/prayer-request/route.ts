import { NextResponse } from "next/server"

import { deleteExpiredPrayerRequests } from "@/lib/prayer-requests"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    await deleteExpiredPrayerRequests()

    const body = await req.json()

    const fullName = String(
      body.fullName || ""
    ).trim()

    const phone = String(
      body.phone || ""
    ).trim()

    const email = String(
      body.email || ""
    ).trim()

    const location = String(
      body.location || ""
    ).trim()

    const request = String(
      body.request || ""
    ).trim()

    if (!fullName || !request) {
      return NextResponse.json(
        {
          error:
            "Full name and prayer request are required",
        },
        { status: 400 }
      )
    }

    const prayerRequest =
      await prisma.prayerRequest.create({
        data: {
          fullName,
          phone: phone || null,
          email: email || null,
          location: location || null,
          request,
        },
      })

    return NextResponse.json(
      prayerRequest
    )

  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error:
          "Failed to submit prayer request",
      },
      { status: 500 }
    )
  }
}
