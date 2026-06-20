import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    orderBy: { startTime: "asc" },
  })

  return NextResponse.json(schedules)
}