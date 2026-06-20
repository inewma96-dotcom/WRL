import { NextRequest, NextResponse } from "next/server"

import { requireRole } from "@/lib/auth-verify"
import { prisma } from "@/lib/prisma"

const SETTINGS_ID = "default"

const defaultSettings = {
  id: SETTINGS_ID,
  heading: "24-Hour Radio Program List",
  subheading: "Wantok Radio Light daily broadcast schedule",
  timeSlotHeading: "Time Slot",
  programHeading: "Program",
  contentFocusHeading: "Content Focus",
}

async function getSettings() {
  return prisma.programListSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: defaultSettings,
  })
}

function cleanText(value: unknown) {
  return String(value || "").trim()
}

export async function GET(req: NextRequest) {
  const includeHidden = req.nextUrl.searchParams.get("includeHidden") === "true"

  if (includeHidden) {
    await requireRole(["ADMIN"])
  }

  const [settings, programs] = await Promise.all([
    getSettings(),
    prisma.radioProgram.findMany({
      where: includeHidden ? undefined : { isHidden: false },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ])

  return NextResponse.json({ settings, programs })
}

export async function POST(req: NextRequest) {
  await requireRole(["ADMIN"])

  const body = await req.json()
  const timeSlot = cleanText(body.timeSlot)
  const program = cleanText(body.program)
  const contentFocus = cleanText(body.contentFocus)
  const sortOrder = Number.parseInt(String(body.sortOrder || "0"), 10)

  if (!timeSlot || !program || !contentFocus) {
    return NextResponse.json(
      { error: "Time slot, program, and content focus are required." },
      { status: 400 },
    )
  }

  const created = await prisma.radioProgram.create({
    data: {
      timeSlot,
      program,
      contentFocus,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  return NextResponse.json(created, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  await requireRole(["ADMIN"])

  const body = await req.json()

  if (body.type === "settings") {
    const updated = await prisma.programListSettings.upsert({
      where: { id: SETTINGS_ID },
      create: {
        ...defaultSettings,
        heading: cleanText(body.heading) || defaultSettings.heading,
        subheading: cleanText(body.subheading) || defaultSettings.subheading,
        timeSlotHeading: cleanText(body.timeSlotHeading) || defaultSettings.timeSlotHeading,
        programHeading: cleanText(body.programHeading) || defaultSettings.programHeading,
        contentFocusHeading:
          cleanText(body.contentFocusHeading) || defaultSettings.contentFocusHeading,
      },
      update: {
        heading: cleanText(body.heading) || defaultSettings.heading,
        subheading: cleanText(body.subheading) || defaultSettings.subheading,
        timeSlotHeading: cleanText(body.timeSlotHeading) || defaultSettings.timeSlotHeading,
        programHeading: cleanText(body.programHeading) || defaultSettings.programHeading,
        contentFocusHeading:
          cleanText(body.contentFocusHeading) || defaultSettings.contentFocusHeading,
      },
    })

    return NextResponse.json(updated)
  }

  const id = cleanText(body.id)
  if (!id) {
    return NextResponse.json({ error: "Program id is required." }, { status: 400 })
  }

  if (body.type === "toggle") {
    const existing = await prisma.radioProgram.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: "Program not found." }, { status: 404 })
    }

    const updated = await prisma.radioProgram.update({
      where: { id },
      data: { isHidden: !existing.isHidden },
    })

    return NextResponse.json(updated)
  }

  const timeSlot = cleanText(body.timeSlot)
  const program = cleanText(body.program)
  const contentFocus = cleanText(body.contentFocus)
  const sortOrder = Number.parseInt(String(body.sortOrder || "0"), 10)

  if (!timeSlot || !program || !contentFocus) {
    return NextResponse.json(
      { error: "Time slot, program, and content focus are required." },
      { status: 400 },
    )
  }

  const updated = await prisma.radioProgram.update({
    where: { id },
    data: {
      timeSlot,
      program,
      contentFocus,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  await requireRole(["ADMIN"])

  const { id } = await req.json()
  const programId = cleanText(id)

  if (!programId) {
    return NextResponse.json({ error: "Program id is required." }, { status: 400 })
  }

  await prisma.radioProgram.delete({ where: { id: programId } })

  return NextResponse.json({ success: true })
}
