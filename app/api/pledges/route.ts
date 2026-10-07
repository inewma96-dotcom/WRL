import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const categories = new Set(["Individual", "Family", "Church", "Group", "Company", "Government", "School"])
const locations = new Set(["PNG", "Overseas"])
const schedules = new Set(["Single", "Fortnightly", "Monthly", "Other"])
const paymentMethods = new Set(["Cash", "Mobile/Internet Banking", "Bank Deposit"])

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const fullName = clean(body.fullName)
    const category = clean(body.category)
    const address = clean(body.address)
    const location = clean(body.location)
    const email = clean(body.email)
    const mobile = clean(body.mobile)
    const church = clean(body.church)
    const congregation = clean(body.congregation)
    const paymentSchedule = clean(body.paymentSchedule)
    const scheduleDetails = clean(body.scheduleDetails)
    const paymentMethod = clean(body.paymentMethod)
    const signedName = clean(body.signedName)
    const pledgeAmount = Number(body.pledgeAmount)
    const pledgeDate = new Date(body.pledgeDate)

    if (!fullName || !email || !mobile || !signedName || !Number.isFinite(pledgeAmount) || pledgeAmount <= 0) {
      return NextResponse.json({ error: "Complete all required pledge details." }, { status: 400 })
    }
    if (!categories.has(category) || !locations.has(location) || !schedules.has(paymentSchedule) || !paymentMethods.has(paymentMethod)) {
      return NextResponse.json({ error: "Choose a valid pledge option." }, { status: 400 })
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || Number.isNaN(pledgeDate.getTime())) {
      return NextResponse.json({ error: "Enter a valid email address and pledge date." }, { status: 400 })
    }

    const pledge = await prisma.pledge.create({
      data: {
        fullName,
        category,
        address: address || null,
        location,
        email,
        mobile,
        church: church || null,
        congregation: congregation || null,
        pledgeAmount,
        paymentSchedule,
        scheduleDetails: scheduleDetails || null,
        paymentMethod,
        signedName,
        pledgeDate,
      },
      select: { id: true },
    })

    return NextResponse.json({ message: "Thank you. Your pledge has been received.", pledgeId: pledge.id })
  } catch (error) {
    console.error("Pledge submission error:", error)
    return NextResponse.json({ error: "We could not submit your pledge. Please try again." }, { status: 500 })
  }
}
